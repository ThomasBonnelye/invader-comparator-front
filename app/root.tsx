import {
  Container,
  Box,
  Snackbar,
  Alert,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { AppProvider, useUI } from '../src/contexts';
import { getTheme } from '../src/theme';
import Header from '../src/components/Header';
import SettingsDrawer from '../src/components/SettingsDrawer';
import { Outlet } from 'react-router';

function AppContent() {
  const { message, messageType, themeMode } = useUI();
  const theme = getTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <SettingsDrawer />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
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

export default function Root() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
