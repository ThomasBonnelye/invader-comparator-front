import {
  Container,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Header from './components/Header';
import SettingsDrawer from './components/SettingsDrawer';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';

function AppContent() {
  const { message, messageType } = useAppContext();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <SettingsDrawer />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <FilterPanel />
        <DataTable />
      </Container>

      <Snackbar open={!!message} autoHideDuration={5000}>
        <Alert severity={messageType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}