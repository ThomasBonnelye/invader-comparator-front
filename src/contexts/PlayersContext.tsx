import { createContext, useContext, useEffect, ReactNode, useCallback } from 'react';
import { PlayersContextType } from './types';
import { useAuth } from './AuthContext';
import { useUids } from '../hooks/useUids';
import { usePlayers as usePlayersHook } from '../hooks/usePlayers';

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export function PlayersProvider({ 
  children,
  showMessage 
}: { 
  children: ReactNode;
  showMessage?: (text: string, type: 'success' | 'error') => void;
}) {
  const { authStatus } = useAuth();

  const { uids, playersMap, loadPlayers, resetPlayers } = usePlayersHook({ authStatus });

  const uidsHook = useUids({
    authStatus,
    showMessage,
    onUidsChanged: loadPlayers,
  });

  // Reset all data when logging out
  useEffect(() => {
    if (authStatus === null) {
      uidsHook.resetUids();
      resetPlayers();
    }
  }, [authStatus, uidsHook.resetUids, resetPlayers]);

  const loadUids = useCallback(async () => {
    await uidsHook.loadUids();
  }, [uidsHook.loadUids]);

  return (
    <PlayersContext.Provider value={{
      myUid: uidsHook.myUid,
      othersUids: uidsHook.othersUids,
      newUid: uidsHook.newUid,
      setMyUid: uidsHook.setMyUid,
      setNewUid: uidsHook.setNewUid,
      updateMyUid: uidsHook.updateMyUid,
      addOtherUid: uidsHook.addOtherUid,
      removeOtherUid: uidsHook.removeOtherUid,
      uids,
      playersMap,
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
