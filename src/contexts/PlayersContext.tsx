import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { fetchPlayers } from '../api/players';
import { fetchPlayerData, type PlayerData } from '../api/spaceInvaders';
import { PlayersContextType, Option } from './types';

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export function PlayersProvider({ 
  children,
  showMessage 
}: { 
  children: ReactNode;
  showMessage?: (text: string, type: 'success' | 'error') => void;
}) {
  const [myUid, setMyUid] = useState('');
  const [othersUids, setOthersUids] = useState<string[]>([]);
  const [newUid, setNewUid] = useState('');
  const [uids, setUids] = useState<string[]>([]);
  const [playersMap, setPlayersMap] = useState<Record<string, PlayerData>>({});

  // Load UIDs from API
  const loadUids = useCallback(async () => {
    try {
      const response = await fetch('/api/uids', {
        credentials: 'include',
      });
      const data = await response.json();
      
      setMyUid(data.myUid);
      setOthersUids(data.othersUids);
    } catch (error) {
      console.error('Failed to load UIDs:', error);
      showMessage?.('Failed to load UIDs', 'error');
    }
  }, [showMessage]);

  // Load players data
  const loadPlayers = useCallback(async () => {
    try {
      const playersData = await fetchPlayers();
      const uidsArray = playersData.map((p) => p.value);
      setUids(uidsArray);

      const newPlayersMap: Record<string, PlayerData> = {};
      
      for (const uid of uidsArray) {
        try {
          const data = await fetchPlayerData(uid);
          newPlayersMap[uid] = data;
        } catch (e) {
          console.error('Player fetch failed:', e);
          newPlayersMap[uid] = { player: uid, invaders: [] };
        }
      }
      
      setPlayersMap(newPlayersMap);
    } catch (error) {
      console.error('Players loading failed:', error);
      setUids([]);
    }
  }, []);

  // Update my UID
  const updateMyUid = useCallback(async () => {
    try {
      const response = await fetch('/api/uids/my-uid', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uid: myUid }),
      });

      if (response.ok) {
        showMessage?.('UID updated successfully', 'success');
        await loadPlayers();
      } else {
        showMessage?.('Failed to update UID', 'error');
      }
    } catch (error) {
      console.error('UID update failed:', error);
      showMessage?.('Failed to update UID', 'error');
    }
  }, [myUid, showMessage, loadPlayers]);

  // Add other UID
  const addOtherUid = useCallback(async () => {
    if (!newUid.trim()) {
      showMessage?.('Please enter a valid UID', 'error');
      return;
    }

    try {
      const response = await fetch('/api/uids/others-uids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uid: newUid }),
      });

      if (response.ok) {
        const data = await response.json();
        setOthersUids(data.othersUids);
        setNewUid('');
        showMessage?.('UID added successfully', 'success');
        await loadPlayers();
      } else {
        showMessage?.('Failed to add UID', 'error');
      }
    } catch (error) {
      console.error('UID addition failed:', error);
      showMessage?.('Failed to add UID', 'error');
    }
  }, [newUid, showMessage, loadPlayers]);

  // Remove other UID
  const removeOtherUid = useCallback(async (uid: string) => {
    try {
      const response = await fetch(
        `/api/uids/others-uids/${encodeURIComponent(uid)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOthersUids(data.othersUids);
        showMessage?.('UID removed successfully', 'success');
        await loadPlayers();
      } else {
        showMessage?.('Failed to remove UID', 'error');
      }
    } catch (error) {
      console.error('UID removal failed:', error);
      showMessage?.('Failed to remove UID', 'error');
    }
  }, [showMessage, loadPlayers]);

  // Memoized first options
  const firstOptions = useMemo(() => {
    return uids.map((uid) => ({
      label: playersMap[uid]?.player || uid,
      value: uid,
    }));
  }, [uids, playersMap]);

  // Memoized second options
  const secondOptions = useMemo(() => {
    return uids.map((uid) => ({
      label: playersMap[uid]?.player || uid,
      value: uid,
    }));
  }, [uids, playersMap]);

  return (
    <PlayersContext.Provider value={{
      myUid,
      othersUids,
      newUid,
      setMyUid,
      setNewUid,
      updateMyUid,
      addOtherUid,
      removeOtherUid,
      uids,
      playersMap,
      firstOptions,
      secondOptions,
      loadUids,
      loadPlayers,
    }}>
      {children}
    </PlayersContext.Provider>
  );
}

export function usePlayers() {
  const context = useContext(PlayersContext);
  
  if (!context) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  
  return context;
}
