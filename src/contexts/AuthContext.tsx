import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { AuthContextType, User, AuthStatus } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage keys
export const GUEST_MY_UID_KEY = 'guest_myUid';
export const GUEST_OTHERS_UIDS_KEY = 'guest_othersUids';

export function AuthProvider({ 
  children,
  onAuthChange 
}: { 
  children: ReactNode;
  onAuthChange?: (authStatus: AuthStatus) => void;
}) {
  const authStatusRef = useRef<AuthStatus>(null);
  const [user, setUser] = useState<User | null>(null);
  const [, forceUpdate] = useState({});

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          console.log('Not authenticated or server error');
          return;
        }

        const data = await response.json();

        if (data.authenticated) {
          authStatusRef.current = 'CONNECTED';
          setUser(data.user);
          
          // Check if there's guest data to migrate
          const hasGuestData = localStorage.getItem(GUEST_MY_UID_KEY) || localStorage.getItem(GUEST_OTHERS_UIDS_KEY);
          if (hasGuestData) {
            console.log('Guest data detected, migrating...');
            try {
              await migrateGuestDataInternal();
              console.log('Guest data migrated successfully');
            } catch (error) {
              console.error('Failed to migrate guest data:', error);
            }
          }
          
          onAuthChange?.('CONNECTED');
          forceUpdate({});
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
  }, [onAuthChange]);

  // Internal migration function (doesn't check authStatus)
  const migrateGuestDataInternal = async () => {
    try {
      const myUid = localStorage.getItem(GUEST_MY_UID_KEY);
      const othersUidsStr = localStorage.getItem(GUEST_OTHERS_UIDS_KEY);
      const othersUids = othersUidsStr ? JSON.parse(othersUidsStr) : [];

      // Send guest data to API
      if (myUid) {
        await fetch('/api/uids/my-uid', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ uid: myUid }),
        });
      }

      // Add other UIDs
      for (const uid of othersUids) {
        await fetch('/api/uids/others-uids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ uid }),
        });
      }

      // Clear localStorage
      localStorage.removeItem(GUEST_MY_UID_KEY);
      localStorage.removeItem(GUEST_OTHERS_UIDS_KEY);
    } catch (error) {
      console.error('Failed to migrate guest data:', error);
      throw error;
    }
  };

  // Continue as guest
  const continueAsGuest = useCallback(() => {
    authStatusRef.current = 'GUEST';
    onAuthChange?.('GUEST');
    forceUpdate({});
  }, [onAuthChange]);

  // Google login redirection
  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google';
  }, []);

  // Migrate guest data to connected user (public API)
  const migrateGuestData = useCallback(async () => {
    if (authStatusRef.current !== 'CONNECTED') {
      console.warn('Cannot migrate guest data: user is not connected');
      return;
    }

    await migrateGuestDataInternal();
    console.log('Guest data migrated successfully');
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      authStatusRef.current = null;
      setUser(null);
      onAuthChange?.(null);
      forceUpdate({});
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, [onAuthChange]);

  return (
    <AuthContext.Provider value={{
      authStatus: authStatusRef.current,
      user,
      continueAsGuest,
      loginWithGoogle,
      logout,
      migrateGuestData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
