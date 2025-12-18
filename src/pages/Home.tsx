import { useAuth, usePlayers } from "../contexts";
import { Button, Divider, Paper, Box, Typography, Card, CardContent, CardActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UidsStepper from "../components/UidsStepper";

export default function Landing() {
  const navigate = useNavigate();
  const { authStatus, loginWithGoogle, continueAsGuest } = useAuth();
  const { myUid } = usePlayers();

  // If user is already authenticated (CONNECTED or GUEST) and has UIDs configured, show navigation cards
  if ((authStatus === 'CONNECTED' || authStatus === 'GUEST') && myUid) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Bienvenue ! Vous êtes {authStatus === 'CONNECTED' ? 'connecté' : 'en mode invité'}.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Comparateur
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comparez vos invaders avec ceux de vos amis
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="large" onClick={() => navigate('/comparator')}>
                Accéder
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    );
  }

  // If user is authenticated but hasn't configured UIDs, show UidsStepper
  if (authStatus === 'CONNECTED' || authStatus === 'GUEST') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Configuration de vos UIDs
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Veuillez configurer votre UID et ceux de vos amis pour continuer.
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
