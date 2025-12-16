import { useState, useCallback, useMemo } from 'react';
import { fetchPlayers } from '../api/players';
import { fetchPlayerData, type PlayerData } from '../api/spaceInvaders';
import { PlayersState } from '../types';

export function usePlayers(selectedFirst: string): PlayersState & { loadPlayers: () => Promise<void> } {
  const [uids, setUids] = useState<string[]>([]);
  const [playersMap, setPlayersMap] = useState<Record<string, PlayerData>>({});

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

  const firstOptions = useMemo(() => {
    return uids.map((uid) => ({
      label: playersMap[uid]?.player || uid,
      value: uid,
    }));
  }, [uids, playersMap]);

  const secondOptions = useMemo(() => {
    return uids
      .filter((uid) => uid !== selectedFirst)
      .map((uid) => ({
        label: playersMap[uid]?.player || uid,
        value: uid,
      }));
  }, [uids, playersMap, selectedFirst]);

  return {
    uids,
    playersMap,
    firstOptions,
    secondOptions,
    loadPlayers,
  };
}
