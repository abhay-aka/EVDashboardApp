// src/components/Dashboard.jsx
import { useEVData } from '../context/EVDataContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function Dashboard({ filters }) {
  const { aggregateData } = useEVData();
  const data = aggregateData(filters);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-semibold">{label}</p>
          <p>{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow col-span-2">
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <p className="text-gray-600">Total Vehicles</p>
            <p className="text-3xl font-bold text-blue-600">{data.totalVehicles.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <p className="text-gray-600">Average Range (miles)</p>
            <p className="text-3xl font-bold text-green-600">{Math.round(data.averageRange)}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <p className="text-gray-600">Unique Makes</p>
            <p className="text-3xl font-bold text-yellow-600">{data.makeDistribution.length}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <p className="text-gray-600">Vehicle Types</p>
            <p className="text-3xl font-bold text-purple-600">{data.vehicleTypes.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Top 10 Makes</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.makeDistribution.map(([name, value]) => ({ name, value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8884d8">
              {data.makeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Top 10 Cities</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.cityDistribution.map(([name, value]) => ({ name, value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#82ca9d">
              {data.cityDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Vehicle Types</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data.vehicleTypes.map(([name, value]) => ({ name, value }))}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.vehicleTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Clean Fuel Eligibility</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data.cleanFuelEligibility.map(([name, value]) => ({ name, value }))}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.cleanFuelEligibility.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow col-span-2">
        <h2 className="text-xl font-semibold mb-4">Model Year Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.modelYearDistribution.map(([year, value]) => ({ year, value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}