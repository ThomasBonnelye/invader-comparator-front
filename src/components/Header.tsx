import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Settings as SettingsIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

const Header = React.memo(function Header() {
  const { authenticated, user, loginWithGoogle, logout, showSettings, setShowSettings, themeMode, toggleTheme } = useAppContext();

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Invader Comparator
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

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
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
