import { createContext, useContext, useState, ReactNode } from 'react';
import { FilterContextType } from './types';

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedFirst, setSelectedFirst] = useState('');
  const [selectedSeconds, setSelectedSeconds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  return (
    <FilterContext.Provider value={{
      selectedFirst,
      selectedSeconds,
      search,
      setSelectedFirst,
      setSelectedSeconds,
      setSearch,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  
  return context;
}
