import { useState, useCallback } from 'react';
import { fetchPlayers } from '../api/players';
import { fetchPlayerData, type PlayerData } from '../api/spaceInvaders';
import { AuthStatus } from '../contexts/types';
import { GUEST_MY_UID_KEY, GUEST_OTHERS_UIDS_KEY } from './useUids';

interface UsePlayersOptions {
  authStatus: AuthStatus;
}

interface UsePlayersReturn {
  uids: string[];
  playersMap: Record<string, PlayerData>;
  loadPlayers: () => Promise<void>;
  resetPlayers: () => void;
}

export function usePlayers({ authStatus }: UsePlayersOptions): UsePlayersReturn {
  const [uids, setUids] = useState<string[]>([]);
  const [playersMap, setPlayersMap] = useState<Record<string, PlayerData>>({});

  const resetPlayers = useCallback(() => {
    setUids([]);
    setPlayersMap({});
  }, []);

  const loadPlayers = useCallback(async () => {
    try {
      if (authStatus === 'CONNECTED') {
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
      } else if (authStatus === 'GUEST') {
        const myUidLocal = localStorage.getItem(GUEST_MY_UID_KEY) || '';
        const othersUidsStr = localStorage.getItem(GUEST_OTHERS_UIDS_KEY);
        const othersUidsLocal = othersUidsStr ? JSON.parse(othersUidsStr) : [];

        const allUids = [myUidLocal, ...othersUidsLocal].filter(Boolean);
        setUids(allUids);

        const newPlayersMap: Record<string, PlayerData> = {};

        for (const uid of allUids) {
          try {
            const data = await fetchPlayerData(uid);
            newPlayersMap[uid] = data;
          } catch (e) {
            console.error('Player fetch failed:', e);
            newPlayersMap[uid] = { player: uid, invaders: [] };
          }
        }

        setPlayersMap(newPlayersMap);
      }
    } catch (error) {
      console.error('Players loading failed:', error);
      setUids([]);
    }
  }, [authStatus]);

  return {
    uids,
    playersMap,
    loadPlayers,
    resetPlayers,
  };
}
