import { useState } from 'react';
import DataTable from '../components/DataTable';
import FilterPanel from '../components/FilterPanel';

export default function Comparator() {
  const [selectedFirst, setSelectedFirst] = useState('');
  const [selectedSeconds, setSelectedSeconds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  return (
    <>
      <FilterPanel
        selectedFirst={selectedFirst}
        selectedSeconds={selectedSeconds}
        search={search}
        onSelectedFirstChange={(value) => {
          setSelectedFirst(value);
          setSelectedSeconds([]);
        }}
        onSelectedSecondsChange={setSelectedSeconds}
        onSearchChange={setSearch}
      />
      <DataTable
        selectedFirst={selectedFirst}
        selectedSeconds={selectedSeconds}
        search={search}
      />
    </>
  );
}
