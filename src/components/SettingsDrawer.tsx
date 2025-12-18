import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useUI, usePlayers } from '../contexts';

const SettingsDrawer = React.memo(function SettingsDrawer() {
  const { showSettings, setShowSettings } = useUI();
  const {
    myUid,
    setMyUid,
    othersUids,
    newUid,
    setNewUid,
    updateMyUid,
    addOtherUid,
    removeOtherUid,
  } = usePlayers();

  return (
    <Drawer
      anchor="right"
      open={showSettings}
      onClose={() => setShowSettings(false)}
    >
      <Box sx={{ width: 400, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">UID Settings</Typography>
          <IconButton onClick={() => setShowSettings(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* My UID Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            My UID
          </Typography>
          <TextField
            fullWidth
            value={myUid}
            onChange={(e) => setMyUid(e.target.value)}
            placeholder="627F176F-54C3-4D32-90EF-C4C80462A2C3"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={() => updateMyUid()}>
            Save my UID
          </Button>
        </Box>

        {/* Others UIDs Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Other players UIDs
          </Typography>

          <List>
            {othersUids.map((uid) => (
              <ListItem
                key={uid}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeOtherUid(uid)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={uid} primaryTypographyProps={{ fontFamily: 'monospace' }} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              value={newUid}
              onChange={(e) => setNewUid(e.target.value)}
              placeholder="FAFDC163-BD97-4372-A647-1A063028E579"
              onKeyPress={(e) => e.key === 'Enter' && addOtherUid()}
            />
            <Button variant="contained" onClick={addOtherUid}>
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
});

export default SettingsDrawer;
