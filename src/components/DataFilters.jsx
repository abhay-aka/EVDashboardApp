// src/components/DataFilters.jsx
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useEVData } from '../context/EVDataContext'; // Add this import

export default function DataFilters({ filters, setFilters }) {
  const { getFilterOptions } = useEVData();
  const { years, states } = getFilterOptions();

  const allYears = [ ...years];
  const allStates = [ ...states];
  return (
    <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow">
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
          Year: {filters.year}
          <ChevronDownIcon className="h-5 w-5" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute mt-2 w-56 bg-white rounded-md shadow-lg max-h-60 overflow-auto z-10">
            {allYears.map((year) => (
              <Menu.Item key={year}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-blue-50' : ''
                    } w-full text-left px-4 py-2 ${filters.year === year ? 'font-bold' : ''}`}
                    onClick={() => setFilters({ ...filters, year })}
                  >
                    {year}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>

      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
          State: {filters.state}
          <ChevronDownIcon className="h-5 w-5" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute mt-2 w-56 bg-white rounded-md shadow-lg max-h-60 overflow-auto z-10">
            {allStates.map((state) => (
              <Menu.Item key={state}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-blue-50' : ''
                    } w-full text-left px-4 py-2 ${filters.state === state ? 'font-bold' : ''}`}
                    onClick={() => setFilters({ ...filters, state })}
                  >
                    {state}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}