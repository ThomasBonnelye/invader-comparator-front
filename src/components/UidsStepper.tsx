import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Button,
  Chip,
  IconButton,
  Stack
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth, usePlayers } from '../contexts';
import { fetchPlayerData, type PlayerData } from '../api/spaceInvaders';

const steps = [
  'Votre UID',
  'UIDS de vos amis',
];

const UidsStepper = React.memo(function UidsStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localMyUid, setLocalMyUid] = useState('');
  const [localOthersUids, setLocalOthersUids] = useState<string[]>([]);
  const [localNewUid, setLocalNewUid] = useState('');
  const [otherUidError, setOtherUidError] = useState('');
  const [localPlayersMap, setLocalPlayersMap] = useState<Record<string, PlayerData>>({});

  const { authStatus } = useAuth();
  const {
    myUid,
    othersUids,
    updateMyUid,
    playersMap,
    loadUids
  } = usePlayers();

  // Initialize local state with context values
  useEffect(() => {
    setLocalMyUid(myUid);
    setLocalOthersUids(othersUids);
  }, [myUid, othersUids]);

  const isValidUUID = (uid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uid.trim());
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!isValidUUID(localMyUid)) {
        alert('Veuillez entrer un UID valide (format UUID).');
        return;
      }

      // Vérifier que le myUid n'est pas déjà dans la liste des autres
      if (localOthersUids.some(uid => uid.toLowerCase() === localMyUid.toLowerCase())) {
        alert('Votre UID ne peut pas être dans la liste des autres joueurs. Veuillez le retirer de la liste des autres avant de continuer.');
        return;
      }

      // Passer à l'étape suivante sans sauvegarder
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddOther = async () => {
    // Réinitialiser l'erreur
    setOtherUidError('');

    if (!isValidUUID(localNewUid)) {
      setOtherUidError('Veuillez entrer un UID valide');
      return;
    }

    // Vérifier les doublons
    if (localMyUid.toLowerCase() === localNewUid.toLowerCase()) {
      setOtherUidError('Vous ne pouvez pas ajouter votre propre UID dans la liste des autres joueurs');
      return;
    }

    if (localOthersUids.some(uid => uid.toLowerCase() === localNewUid.toLowerCase())) {
      setOtherUidError('Cet UID est déjà dans la liste');
      return;
    }

    // Ajouter à la liste locale
    setLocalOthersUids([...localOthersUids, localNewUid]);

    // Charger les données du joueur depuis l'API
    try {
      const playerData = await fetchPlayerData(localNewUid);
      setLocalPlayersMap(prev => ({
        ...prev,
        [localNewUid]: playerData
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des données du joueur:', error);
      // En cas d'erreur, utiliser l'UID comme nom
      setLocalPlayersMap(prev => ({
        ...prev,
        [localNewUid]: { player: localNewUid, invaders: [] }
      }));
    }

    setLocalNewUid('');
  };

  const handleRemoveOther = (uid: string) => {
    // Retirer de la liste locale
    setLocalOthersUids(localOthersUids.filter((u) => u !== uid));
  };

  const handleFinish = async () => {
    // Sauvegarder tout : myUid + othersUids
    setIsUpdating(true);
    
    try {
      // Sauvegarder myUid
      await updateMyUid(localMyUid);
      
      // Sauvegarder othersUids
      if (authStatus === 'GUEST') {
        const { GUEST_OTHERS_UIDS_KEY } = await import('../contexts/AuthContext');
        localStorage.setItem(GUEST_OTHERS_UIDS_KEY, JSON.stringify(localOthersUids));
      } else if (authStatus === 'CONNECTED') {
        // Sauvegarder via API
        for (const uid of localOthersUids) {
          if (!othersUids.includes(uid)) {
            await fetch('/api/uids/others-uids', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ uid }),
            });
          }
        }
        
        // Supprimer les UIDs retirés
        for (const uid of othersUids) {
          if (!localOthersUids.includes(uid)) {
            await fetch(`/api/uids/others-uids/${encodeURIComponent(uid)}`, {
              method: 'DELETE',
              credentials: 'include',
            });
          }
        }
      }
      
      // Recharger les UIDs pour rafraîchir l'affichage
      await loadUids();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
    
    setIsUpdating(false);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mon UID
            </Typography>
            <TextField
              fullWidth
              value={localMyUid}
              onChange={(e) => setLocalMyUid(e.target.value)}
              placeholder="AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
              error={!isValidUUID(localMyUid) && localMyUid.length > 0}
              helperText={!isValidUUID(localMyUid) && localMyUid.length > 0 ? 'Format UUID invalide' : ''}
              sx={{ mb: 2 }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              UIDs des autres
            </Typography>
            <Box sx={{ mb: 2 }}>
              {localOthersUids.map((uid) => {
                const playerName = localPlayersMap[uid]?.player || playersMap[uid]?.player || uid;
                return (
                  <Chip
                    key={uid}
                    label={playerName}
                    onDelete={() => handleRemoveOther(uid)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                );
              })}
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                value={localNewUid}
                onChange={(e) => {
                  setLocalNewUid(e.target.value);
                  // Réinitialiser l'erreur quand l'utilisateur tape
                  if (otherUidError) {
                    setOtherUidError('');
                  }
                }}
                placeholder="Entrez un UID d'un de vos amis"
                error={!!otherUidError || (!isValidUUID(localNewUid) && localNewUid.length > 0)}
                helperText={otherUidError || ((!isValidUUID(localNewUid) && localNewUid.length > 0) ? 'Format UUID invalide' : '')}
              />
              <IconButton onClick={handleAddOther} color="primary">
                <AddIcon />
              </IconButton>
            </Stack>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Précédent
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === 0 && (
              <Button onClick={handleNext}>
                Suivant
              </Button>
            )}
            {activeStep === 1 && (
              <Button onClick={handleFinish} variant="contained" disabled={isUpdating}>
                {isUpdating ? 'Mise à jour...' : 'Valider'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
});

export default UidsStepper;
