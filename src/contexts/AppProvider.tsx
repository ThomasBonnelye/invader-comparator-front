import { ReactNode, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { UIProvider, useUI } from './UIContext';
import { FilterProvider } from './FilterContext';
import { PlayersProvider, usePlayers } from './PlayersContext';

/**
 * Component that handles loading data when authenticated
 */
function DataLoaderEffect() {
  const { authenticated } = useAuth();
  const { loadUids, loadPlayers } = usePlayers();
  
  useEffect(() => {
    if (authenticated) {
      loadUids();
      loadPlayers();
    }
  }, [authenticated, loadUids, loadPlayers]);
  
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
