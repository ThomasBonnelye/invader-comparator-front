import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children,
  onAuthChange 
}: { 
  children: ReactNode;
  onAuthChange?: (authenticated: boolean) => void;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
          setAuthenticated(true);
          setUser(data.user);
          onAuthChange?.(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
  }, [onAuthChange]);

  // Google login redirection
  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google';
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setAuthenticated(false);
      setUser(null);
      onAuthChange?.(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, [onAuthChange]);

  return (
    <AuthContext.Provider value={{
      authenticated,
      user,
      loginWithGoogle,
      logout,
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
