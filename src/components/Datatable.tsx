import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { compareInvaders } from '../utils/compareInvaders';

const DataTable = React.memo(function DataTable() {
  const { selectedFirst, selectedSeconds, search, playersMap } = useAppContext();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    if (!selectedFirst || selectedSeconds.length === 0) {
      setData({});
      return;
    }

    setLoading(true);

    const referenceInvaders = playersMap[selectedFirst]?.invaders || [];

    const othersData: Record<string, string[]> = {};
    selectedSeconds.forEach((uid) => {
      const playerName = playersMap[uid]?.player || uid;
      othersData[playerName] = playersMap[uid]?.invaders || [];
    });

    const comparisonResult = compareInvaders(referenceInvaders, othersData);

    setTimeout(() => {
      setData(comparisonResult);
      setLoading(false);
    }, 300);
  }, [selectedFirst, selectedSeconds, playersMap]);

  const filteredData = React.useMemo(() => {
    if (!search.trim()) return data;

    const result: Record<string, string[]> = {};
    Object.entries(data).forEach(([player, invaders]) => {
      const filtered = invaders.filter((inv) =>
        inv.toLowerCase().includes(search.toLowerCase())
      );
      if (filtered.length > 0) {
        result[player] = filtered;
      }
    });
    return result;
  }, [data, search]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (Object.keys(filteredData).length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {selectedFirst && selectedSeconds.length > 0
            ? 'No invaders found matching your search'
            : 'Select players to compare their invaders'}
        </Typography>
      </Paper>
    );
  }

  const maxRows = React.useMemo(() => {
    return Math.max(...Object.values(filteredData).map((arr) => arr.length));
  }, [filteredData]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(filteredData).map((player) => (
              <TableCell key={player}>
                <Typography variant="h6">{player}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {filteredData[player].length} invaders
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.keys(filteredData).map((player) => (
                <TableCell key={player}>
                  {filteredData[player][rowIndex] || ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default DataTable;
