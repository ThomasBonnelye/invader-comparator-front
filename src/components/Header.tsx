import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { useUI, useAuth } from "../contexts";

const Header = React.memo(function Header() {
  const { authStatus, user, loginWithGoogle } = useAuth();
  const { setShowSettings } = useUI();

  const handleLoginFromGuest = async () => {
    // Initiate login - migration will happen automatically in AuthContext
    loginWithGoogle();
  };

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Invader Comparator
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {authStatus === null ? (
            <IconButton color="inherit" onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
          ) : authStatus === "GUEST" ? (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Chip label="Mode Invité" size="small" color="default" />
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleLoginFromGuest}
              >
                Se connecter
              </Button>
              <IconButton color="inherit" onClick={() => setShowSettings(true)}>
                <SettingsIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography>{user?.name}</Typography>
              <IconButton color="inherit" onClick={() => setShowSettings(true)}>
                <SettingsIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
