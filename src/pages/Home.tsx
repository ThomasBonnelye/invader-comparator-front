import { useAppContext } from "../contexts";
import { Button, Divider, Paper, Box, Typography } from "@mui/material";
import UidsStepper from "../components/UidsStepper";

export default function Landing() {
  const {
    authStatus,
    loginWithGoogle,
    continueAsGuest
  } = useAppContext();

  // If user is already authenticated (CONNECTED or GUEST), show different content
  if (authStatus === 'CONNECTED' || authStatus === 'GUEST') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">
          Bienvenue ! Vous êtes {authStatus === 'CONNECTED' ? 'connecté' : 'en mode invité'}.
        </Typography>
        <UidsStepper />
      </Box>
    );
  }

  // Show login/guest options
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        p: 2
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Invader Comparator
        </Typography>
        
        <Button 
          variant="contained" 
          fullWidth
          size="large"
          onClick={loginWithGoogle}
          sx={{ mb: 2 }}
        >
          Se connecter avec Google
        </Button>
        
        <Divider sx={{ my: 2 }}>ou</Divider>
        
        <Button 
          variant="outlined" 
          fullWidth
          size="large"
          onClick={continueAsGuest}
        >
          Continuer en tant qu'invité
        </Button>
      </Paper>
    </Box>
  );
}
