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
import { usePlayers } from '../contexts';

interface FilterPanelProps {
  selectedFirst: string;
  selectedSeconds: string[];
  search: string;
  onSelectedFirstChange: (value: string) => void;
  onSelectedSecondsChange: (value: string[]) => void;
  onSearchChange: (value: string) => void;
}

const FilterPanel = React.memo(function FilterPanel({
  selectedFirst,
  selectedSeconds,
  search,
  onSelectedFirstChange,
  onSelectedSecondsChange,
  onSearchChange,
}: FilterPanelProps) {
  const { uids, playersMap } = usePlayers();

  const options = uids.map((uid) => ({
    label: playersMap[uid]?.player || uid,
    value: uid,
  }));

  const handleSecondsChange = (event: SelectChangeEvent<typeof selectedSeconds>) => {
    const value = event.target.value;
    onSelectedSecondsChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Joueur de référence</InputLabel>
          <Select
            value={selectedFirst}
            onChange={(e) => onSelectedFirstChange(e.target.value)}
            label="Joueur de référence"
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 300 }} disabled={!selectedFirst}>
          <InputLabel>Comparer avec</InputLabel>
          <Select
            multiple
            value={selectedSeconds}
            onChange={handleSecondsChange}
            label="Comparer avec"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const opt = options.find((o) => o.value === value);
                  return <Chip key={value} label={opt?.label || value} size="small" />;
                })}
              </Box>
            )}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Rechercher des invader"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </Paper>
  );
});

export default FilterPanel;
