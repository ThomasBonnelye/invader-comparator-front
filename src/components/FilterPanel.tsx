import React from 'react';
import {
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';

const FilterPanel = React.memo(function FilterPanel() {
  const {
    firstOptions,
    secondOptions,
    selectedFirst,
    selectedSeconds,
    search,
    setSelectedFirst,
    setSelectedSeconds,
    setSearch,
  } = useAppContext();

  const handleSecondsChange = React.useCallback((event: SelectChangeEvent<typeof selectedSeconds>) => {
    const value = event.target.value;
    setSelectedSeconds(typeof value === 'string' ? value.split(',') : value);
  }, [setSelectedSeconds]);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Reference Player</InputLabel>
          <Select
            value={selectedFirst}
            onChange={(e) => {
              setSelectedFirst(e.target.value);
              setSelectedSeconds([]);
            }}
            label="Reference Player"
          >
            {firstOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 300 }} disabled={!selectedFirst}>
          <InputLabel>Compare with</InputLabel>
          <Select
            multiple
            value={selectedSeconds}
            onChange={handleSecondsChange}
            label="Compare with"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const opt = secondOptions.find((o) => o.value === value);
                  return <Chip key={value} label={opt?.label || value} size="small" />;
                })}
              </Box>
            )}
          >
            {secondOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search invaders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </Paper>
  );
});

export default FilterPanel;
