import { ReactNode, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { UIProvider, useUI } from './UIContext';
import { FilterProvider } from './FilterContext';
import { PlayersProvider, usePlayers } from './PlayersContext';

/**
 * Component that handles loading data when authenticated or in guest mode
 */
function DataLoaderEffect() {
  const { authStatus } = useAuth();
  const { loadUids, loadPlayers } = usePlayers();
  
  useEffect(() => {
    if (authStatus === 'CONNECTED' || authStatus === 'GUEST') {
      loadUids();
      loadPlayers();
    }
  }, [authStatus, loadUids, loadPlayers]);
  
  return null;
}

/**
 * Inner wrapper that provides players context with UI context
 */
function DataLoader({ children }: { children: ReactNode }) {
  const { showMessage } = useUI();
  
  return (
    <PlayersProvider showMessage={showMessage}>
      <DataLoaderEffect />
      {children}
    </PlayersProvider>
  );
}

/**
 * Combined provider that wraps all context providers
 */
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <AuthProvider>
        <DataLoader>
          <FilterProvider>
            {children}
          </FilterProvider>
        </DataLoader>
      </AuthProvider>
    </UIProvider>
  );
}
