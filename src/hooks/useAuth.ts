import { useState, useCallback } from 'react';
import { AuthState, AuthActions } from '../types';

export function useAuth(): AuthState & AuthActions & { setAuthState: (auth: boolean, user: AuthState['user']) => void } {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthState['user']>(null);

  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google';
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Reset state on logout
      setAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error; // Let the parent hook handle the message
    }
  }, []);

  // Internal method to set auth state (used by AppContext)
  const setAuthState = useCallback((auth: boolean, userData: AuthState['user']) => {
    setAuthenticated(auth);
    setUser(userData);
  }, []);

  return {
    authenticated,
    user,
    loginWithGoogle,
    logout,
    setAuthState,
  };
}
