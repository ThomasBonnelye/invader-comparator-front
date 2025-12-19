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
  TablePagination,
} from '@mui/material';
import { usePlayers } from '../contexts';
import { compareInvaders } from '../utils/compareInvaders';

interface DataTableProps {
  selectedFirst: string;
  selectedSeconds: string[];
  search: string;
}

const DataTable = React.memo(function DataTable({
  selectedFirst,
  selectedSeconds,
  search,
}: DataTableProps) {
  const { playersMap } = usePlayers();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Record<string, string[]>>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  const maxRows = React.useMemo(() => {
    return Math.max(...Object.values(filteredData).map((arr) => arr.length));
  }, [filteredData]);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(0);
  }, [search, selectedFirst, selectedSeconds]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const startRow = page * rowsPerPage;
  const paginatedRowCount = Math.min(rowsPerPage, maxRows - startRow);

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

  return (
    <Paper>
      <TableContainer>
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
            {Array.from({ length: paginatedRowCount }).map((_, index) => {
              const rowIndex = startRow + index;
              return (
                <TableRow key={rowIndex}>
                  {Object.keys(filteredData).map((player) => (
                    <TableCell key={player}>
                      {filteredData[player][rowIndex] || ''}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={maxRows}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Éléments par page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
        }
      />
    </Paper>
  );
});

export default DataTable;
