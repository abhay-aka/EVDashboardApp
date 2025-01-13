import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DataFilters from './components/DataFilters';
import { EVDataProvider } from './context/EVDataContext';

const queryClient = new QueryClient();

function App() {
  const [filters, setFilters] = useState({
    year: 'All',
    state: 'All'
  });

  return (
    <QueryClientProvider client={queryClient}>
      <EVDataProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <DataFilters filters={filters} setFilters={setFilters} />
            <Dashboard filters={filters} />
          </main>
        </div>
      </EVDataProvider>
    </QueryClientProvider>
  );
}

export default App;