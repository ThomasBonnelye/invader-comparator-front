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
import { useAppContext } from '../contexts/AppContext';

const steps = [
  'Votre UID',
  'UIDS de vos amis',
];

const UidsStepper = React.memo(function UidsStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [originalMyUid, setOriginalMyUid] = useState('');

  const {
    myUid,
    setMyUid,
    othersUids,
    newUid,
    setNewUid,
    updateMyUid,
    addOtherUid,
    removeOtherUid
  } = useAppContext();

  useEffect(() => {
    setOriginalMyUid(myUid);
  }, [myUid]);

  const isValidUUID = (uid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uid.trim());
  };

  const handleNext = async () => {
    if (activeStep === 0 && !isUpdating) {
      if (!isValidUUID(myUid)) {
        alert('Veuillez entrer un UID valide (format UUID).');
        return;
      }
      if (myUid.trim() !== originalMyUid) {
        setIsUpdating(true);
        await updateMyUid();
        setIsUpdating(false);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddOther = async () => {
    if (!isValidUUID(newUid)) {
      alert('Veuillez entrer un UID valide');
      return;
    }
    await addOtherUid();
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
              value={myUid}
              onChange={(e) => setMyUid(e.target.value)}
              placeholder="627F176F-54C3-4D32-90EF-C4C80462A2C3"
              error={!isValidUUID(myUid) && myUid.length > 0}
              helperText={!isValidUUID(myUid) && myUid.length > 0 ? 'Format UUID invalide' : ''}
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
              {othersUids.map((uid) => (
                <Chip
                  key={uid}
                  label={uid}
                  onDelete={() => removeOtherUid(uid)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                value={newUid}
                onChange={(e) => setNewUid(e.target.value)}
                placeholder="Entrez un UID d'un de vos amis"
                error={!isValidUUID(newUid) && newUid.length > 0}
                helperText={!isValidUUID(newUid) && newUid.length > 0 ? 'Format UUID invalide' : ''}
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
              <Button onClick={handleNext} loading={isUpdating} disabled={isUpdating}>
                Suivant
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
});

export default UidsStepper;
