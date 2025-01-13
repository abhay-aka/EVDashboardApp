// src/context/EVDataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const EVDataContext = createContext();

export function EVDataProvider({ children }) {
  const [evData, setEVData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/vedant-patil-mapup/analytics-dashboard-assessment/refs/heads/main/data-to-visualize/Electric_Vehicle_Population_Data.csv',
          {
            responseType: 'text',
          }
        );

        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("Parsing errors:", results.errors);
            }

            const cleanData = results.data
              .filter(item =>
                item["VIN (1-10)"] &&
                item["Model Year"] &&
                item["Make"] &&
                item["Model"]
              )
              .map(item => ({
                VIN: item["VIN (1-10)"],
                County: item["County"],
                City: item["City"],
                State: item["State"],
                PostalCode: item["Postal Code"],
                Model_Year: parseInt(item["Model Year"]),
                Make: item["Make"],
                Model: item["Model"],
                Electric_Vehicle_Type: item["Electric Vehicle Type"],
                Clean_Alternative_Fuel_Vehicle: item["Clean Alternative Fuel Vehicle (CAFV) Eligibility"],
                Electric_Range: parseInt(item["Electric Range"]) || 0,
                Base_MSRP: parseInt(item["Base MSRP"]) || 0,
                Legislative_District: item["Legislative District"],
                DOL_Vehicle_ID: item["DOL Vehicle ID"],
                Electric_Utility: item["Electric Utility"],
                Census_Tract: item["2020 Census Tract"]
              }));

            setEVData(cleanData => cleanData);
            setLoading(false);
          },
          error: (error) => {
            console.error("Parsing Error:", error);
            setError('Error parsing CSV: ' + error.message);
            setLoading(false);
          },
        });
      } catch (err) {
        console.error("Fetch Error:", err);
        setError('Error fetching data: ' + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const aggregateData = (filters) => {
    if (!evData.length) return {
      totalVehicles: 0,
      makeDistribution: [],
      averageRange: 0,
      vehicleTypes: [],
      cityDistribution: [],
      countyDistribution: [],
      utilityProviders: [],
      cleanFuelEligibility: [],
      modelYearDistribution: [],
      postalCodeDistribution: [],
      averageMSRP: 0
    };

    const filteredData = evData.filter(car => 
      (filters.state === 'All' || car.State === filters.state) && 
      (filters.year === 'All' || car.Model_Year.toString() === filters.year)
    );

    // Calculate various distributions
    const distributions = {
      makes: {},
      cities: {},
      counties: {},
      vehicleTypes: {},
      utilities: {},
      cleanFuel: {},
      postalCodes: {},
      modelYears: {}
    };

    filteredData.forEach(car => {
      // Increment counters for each distribution
      distributions.makes[car.Make] = (distributions.makes[car.Make] || 0) + 1;
      distributions.cities[car.City] = (distributions.cities[car.City] || 0) + 1;
      distributions.counties[car.County] = (distributions.counties[car.County] || 0) + 1;
      distributions.vehicleTypes[car.Electric_Vehicle_Type] = (distributions.vehicleTypes[car.Electric_Vehicle_Type] || 0) + 1;
      distributions.cleanFuel[car.Clean_Alternative_Fuel_Vehicle] = (distributions.cleanFuel[car.Clean_Alternative_Fuel_Vehicle] || 0) + 1;
      distributions.postalCodes[car.PostalCode] = (distributions.postalCodes[car.PostalCode] || 0) + 1;
      distributions.modelYears[car.Model_Year] = (distributions.modelYears[car.Model_Year] || 0) + 1;

      // Handle multiple utilities
      const utilities = car.Electric_Utility?.split('|') || [];
      utilities.forEach(utility => {
        distributions.utilities[utility] = (distributions.utilities[utility] || 0) + 1;
      });
    });

    // Calculate averages and prepare return data
    const averageRange = filteredData.length
      ? filteredData.reduce((acc, car) => acc + car.Electric_Range, 0) / filteredData.length
      : 0;

    const averageMSRP = filteredData.length
      ? filteredData.reduce((acc, car) => acc + (car.Base_MSRP || 0), 0) / filteredData.length
      : 0;

    const sortByValue = obj => Object.entries(obj)
      .sort((a, b) => b[1] - a[1]);

    return {
      totalVehicles: filteredData.length,
      makeDistribution: sortByValue(distributions.makes).slice(0, 10),
      averageRange,
      averageMSRP,
      vehicleTypes: sortByValue(distributions.vehicleTypes),
      cityDistribution: sortByValue(distributions.cities).slice(0, 10),
      countyDistribution: sortByValue(distributions.counties).slice(0, 10),
      utilityProviders: sortByValue(distributions.utilities).slice(0, 5),
      cleanFuelEligibility: sortByValue(distributions.cleanFuel),
      modelYearDistribution: Object.entries(distributions.modelYears)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0])),
      postalCodeDistribution: sortByValue(distributions.postalCodes).slice(0, 10),
      legislativeDistribution: Object.entries(
        filteredData.reduce((acc, car) => {
          acc[car.Legislative_District] = (acc[car.Legislative_District] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]).slice(0, 10)
    };
  };

  const getFilterOptions = () => {
    const years = [...new Set(evData.map(car => car.Model_Year.toString()))]
      .sort((a, b) => b - a); // Sort years in descending order
    const states = [...new Set(evData.map(car => car.State))].sort();
    console.log(states)
    return {
      years: ['All', ...years],
      states: ['All', ...states]
    };
  };

  return (
    <EVDataContext.Provider 
      value={{ 
        evData, 
        aggregateData, 
        loading, 
        error, 
        getFilterOptions 
      }}
    >
      {children}
    </EVDataContext.Provider>
  );
}

export function useEVData() {
  const context = useContext(EVDataContext);

  if (!context) {
    throw new Error('useEVData must be used within an EVDataProvider');
  }
  return context;
}