import {
  Container,
  Box,
  Snackbar,
  Alert,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { AppProvider, useAppContext } from './contexts';
import { getTheme } from './theme';
import Header from './components/Header';
import SettingsDrawer from './components/SettingsDrawer';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';

function AppContent() {
  const { message, messageType, themeMode } = useAppContext();
  const theme = getTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
