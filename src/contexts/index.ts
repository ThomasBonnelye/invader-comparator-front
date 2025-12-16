// Export the combined provider
export { AppProvider } from './AppProvider';

// Export individual hooks
export { useAuth } from './AuthContext';
export { useUI } from './UIContext';
export { useFilter } from './FilterContext';
export { usePlayers } from './PlayersContext';

// Export combined hook for backward compatibility
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import { useFilter } from './FilterContext';
import { usePlayers } from './PlayersContext';

/**
 * Combined hook to access all contexts
 */
export function useAppContext() {
  const auth = useAuth();
  const ui = useUI();
  const filter = useFilter();
  const players = usePlayers();
  
  return {
    ...auth,
    ...ui,
    ...filter,
    ...players,
  };
}

// Export types
export type * from './types';
