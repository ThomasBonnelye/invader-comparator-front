import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Stack,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useUI, usePlayers, useAuth } from '../contexts';
import { fetchPlayerData, type PlayerData } from '../api/spaceInvaders';

const isValidUUID = (uid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uid.trim());
};

function SettingsDrawer() {
  const { showSettings, setShowSettings, themeMode, toggleTheme } = useUI();
  const { logout, authStatus } = useAuth();
  const {
    myUid,
    setMyUid,
    othersUids,
    updateMyUid,
    playersMap,
    loadUids,
  } = usePlayers();

  const [localMyUid, setLocalMyUid] = useState('');
  const [localOthersUids, setLocalOthersUids] = useState<string[]>([]);
  const [localNewUid, setLocalNewUid] = useState('');
  const [otherUidError, setOtherUidError] = useState('');
  const [localPlayersMap, setLocalPlayersMap] = useState<Record<string, PlayerData>>({});

  useEffect(() => {
    setLocalMyUid(myUid);
    setLocalOthersUids(othersUids);
  }, [myUid, othersUids]);

  const handleAddOther = async () => {
    setOtherUidError('');

    if (!isValidUUID(localNewUid)) {
      setOtherUidError('Please enter a valid UID');
      return;
    }

    if (localMyUid.toLowerCase() === localNewUid.toLowerCase()) {
      setOtherUidError('You cannot add your own UID to the other players list');
      return;
    }

    if (localOthersUids.some(uid => uid.toLowerCase() === localNewUid.toLowerCase())) {
      setOtherUidError('This UID is already in the list');
      return;
    }

    const newUids = [...localOthersUids, localNewUid];
    setLocalOthersUids(newUids);

    try {
      const playerData = await fetchPlayerData(localNewUid);
      setLocalPlayersMap(prev => ({
        ...prev,
        [localNewUid]: playerData
      }));
    } catch (error) {
      console.error('Error loading player data:', error);
      setLocalPlayersMap(prev => ({
        ...prev,
        [localNewUid]: { player: localNewUid, invaders: [] }
      }));
    }

    await saveOthersUids(newUids);
    setLocalNewUid('');
  };

  const handleRemoveOther = async (uid: string) => {
    const newUids = localOthersUids.filter((u) => u !== uid);
    setLocalOthersUids(newUids);
    await saveOthersUids(newUids);
  };

  const saveMyUid = async (uid: string) => {
    if (!isValidUUID(uid)) {
      return;
    }

    if (localOthersUids.some(otherUid => otherUid.toLowerCase() === uid.toLowerCase())) {
      alert('Your UID cannot be in the other players list.');
      return;
    }

    try {
      setMyUid(uid);
      await updateMyUid(uid);
    } catch (error) {
      console.error('Error saving UID:', error);
    }
  };

  const saveOthersUids = async (uids: string[]) => {
    try {
      if (authStatus === 'GUEST') {
        const { GUEST_OTHERS_UIDS_KEY } = await import('../contexts/AuthContext');
        localStorage.setItem(GUEST_OTHERS_UIDS_KEY, JSON.stringify(uids));
        await loadUids();
      } else if (authStatus === 'CONNECTED') {
        for (const uid of othersUids) {
          if (!uids.includes(uid)) {
            await fetch(`/api/uids/others-uids/${encodeURIComponent(uid)}`, {
              method: 'DELETE',
              credentials: 'include',
            });
          }
        }

        for (const uid of uids) {
          if (!othersUids.includes(uid)) {
            await fetch('/api/uids/others-uids', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ uid }),
            });
          }
        }

        await loadUids();
      }
    } catch (error) {
      console.error('Error saving other UIDs:', error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={showSettings}
      onClose={() => setShowSettings(false)}
    >
      <Box sx={{ width: 450, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Settings</Typography>
          <IconButton onClick={() => setShowSettings(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {themeMode === 'dark' ? <Brightness7Icon sx={{ mr: 1 }} /> : <Brightness4Icon sx={{ mr: 1 }} />}
            <Typography variant="h6">Theme</Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={themeMode === 'dark'}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label={themeMode === 'dark' ? 'Dark mode' : 'Light mode'}
          />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ mb: 4, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">UID Management</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              <Typography variant="subtitle1">My UID</Typography>
            </Box>
            <TextField
              fullWidth
              value={localMyUid}
              onChange={(e) => setLocalMyUid(e.target.value)}
              onBlur={(e) => saveMyUid(e.target.value)}
              placeholder="AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
              error={!isValidUUID(localMyUid) && localMyUid.length > 0}
              helperText={!isValidUUID(localMyUid) && localMyUid.length > 0 ? 'Invalid UUID format' : ''}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              <Typography variant="subtitle1">Other players UIDs</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              {localOthersUids.map((uid) => {
                const playerName = localPlayersMap[uid]?.player || playersMap[uid]?.player || uid;
                return (
                  <Chip
                    key={uid}
                    label={playerName}
                    onDelete={() => handleRemoveOther(uid)}
                    sx={{ mr: 1, mb: 1 }}
                    size="small"
                  />
                );
              })}
            </Box>

            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TextField
                fullWidth
                value={localNewUid}
                onChange={(e) => {
                  setLocalNewUid(e.target.value);
                  if (otherUidError) {
                    setOtherUidError('');
                  }
                }}
                placeholder="Enter a friend's UID"
                error={!!otherUidError || (!isValidUUID(localNewUid) && localNewUid.length > 0)}
                helperText={otherUidError || ((!isValidUUID(localNewUid) && localNewUid.length > 0) ? 'Invalid UUID format' : '')}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOther()}
              />
              <IconButton onClick={handleAddOther} color="primary" sx={{ mt: 1 }}>
                <AddIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {authStatus === 'CONNECTED' && (
          <Box>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={logout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default SettingsDrawer;
