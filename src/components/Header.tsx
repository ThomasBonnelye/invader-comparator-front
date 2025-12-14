import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

export default function Header() {
  const { authenticated, user, loginWithGoogle, logout, showSettings, setShowSettings } = useAppContext();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Invader Comparator
        </Typography>

        {!authenticated ? (
          <Button color="inherit" onClick={loginWithGoogle}>
            Sign in with Google
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography>{user?.name}</Typography>
            <IconButton color="inherit" onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}