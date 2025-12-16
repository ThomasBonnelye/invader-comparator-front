import { useState } from 'react';
import { FiltersState, FiltersActions } from '../types';

export function useFilters(): FiltersState & FiltersActions {
  const [selectedFirst, setSelectedFirst] = useState('');
  const [selectedSeconds, setSelectedSeconds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  return {
    selectedFirst,
    selectedSeconds,
    search,
    setSelectedFirst,
    setSelectedSeconds,
    setSearch,
  };
}
