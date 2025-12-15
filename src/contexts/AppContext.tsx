import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { fetchPlayers } from '../api/players';
import { fetchPlayerData, type PlayerData } from '../api/spaceInvaders';

/**
 * Authentication context interface
 */
interface User {
  googleId: string;
  email: string;
  name: string;
}

/**
 * Dropdown option interface
 */
interface Option {
  label: string;
  value: string;
}

/**
 * Application context interface
 */
interface AppContextType {

  // AUTHENTICATION
  authenticated: boolean;
  user: User | null;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  
  // UIDS MANAGEMENT
  myUid: string;
  othersUids: string[];
  newUid: string;
  setMyUid: (uid: string) => void;
  setNewUid: (uid: string) => void;
  updateMyUid: () => Promise<void>;
  addOtherUid: () => Promise<void>;
  removeOtherUid: (uid: string) => Promise<void>;
  
  // DATA MANAGEMENT
  uids: string[];
  playersMap: Record<string, PlayerData>;
  firstOptions: Option[];
  secondOptions: Option[];
  
  // FILTERS & SELECTIONS
  selectedFirst: string;
  selectedSeconds: string[];
  search: string;
  setSelectedFirst: (value: string) => void;
  setSelectedSeconds: (values: string[]) => void;
  setSearch: (value: string) => void;
  
  // UI STATE
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  message: string;
  messageType: 'success' | 'error';
  showMessage: (text: string, type: 'success' | 'error') => void;
  
  // THEME
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {

  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [myUid, setMyUid] = useState('');
  const [othersUids, setOthersUids] = useState<string[]>([]);
  const [newUid, setNewUid] = useState('');
  const [uids, setUids] = useState<string[]>([]);
  const [playersMap, setPlayersMap] = useState<Record<string, PlayerData>>({});

  const [selectedFirst, setSelectedFirst] = useState('');
  const [selectedSeconds, setSelectedSeconds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showSettings, setShowSettings] = useState(false);
  
  // Theme mode state with localStorage persistence
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  // UI state management
  const showMessage = useCallback((text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    
    setTimeout(() => {
      setMessage('');
    }, 5000);
  }, []);

  // Theme toggle function
  const toggleTheme = useCallback(() => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  }, []);

  // async functions for UIDs and players loading
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
      showMessage('Failed to load UIDs', 'error');
    }
  }, [showMessage]);

  // async function to load players data
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

  // async functions for authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include',
        });
        
        // Check if response is OK before parsing JSON
        if (!response.ok) {
          console.log('Not authenticated or server error');
          return;
        }

        const data = await response.json();

        if (data.authenticated) {
          setAuthenticated(true);
          setUser(data.user);
          
          await loadUids();
          await loadPlayers();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
  }, [loadUids, loadPlayers]);

  // google login redirection
  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google';
  }, []);

  // logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Reset state on logout
      setAuthenticated(false);
      setUser(null);
      setMyUid('');
      setOthersUids([]);
      setShowSettings(false);
    } catch (error) {
      console.error('Logout failed:', error);
      showMessage('Logout failed', 'error');
    }
  }, [showMessage]);

  // async function to update my UID
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
        showMessage('UID updated successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to update UID', 'error');
      }
    } catch (error) {
      console.error('UID update failed:', error);
      showMessage('Failed to update UID', 'error');
    }
  }, [myUid, showMessage, loadPlayers]);

  // async function to add an other UID
  const addOtherUid = useCallback(async () => {
    if (!newUid.trim()) {
      showMessage('Please enter a valid UID', 'error');
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
        showMessage('UID added successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to add UID', 'error');
      }
    } catch (error) {
      console.error('UID addition failed:', error);
      showMessage('Failed to add UID', 'error');
    }
  }, [newUid, showMessage, loadPlayers]);

  /**
   * async function to remove an other UID
   * 
   * @param uid - UID to remove
   */
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
        showMessage('UID removed successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to remove UID', 'error');
      }
    } catch (error) {
      console.error('UID removal failed:', error);
      showMessage('Failed to remove UID', 'error');
    }
  }, [showMessage, loadPlayers]);

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

  const contextValue = useMemo<AppContextType>(() => ({
    authenticated,
    user,
    loginWithGoogle,
    logout,
    
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
    
    selectedFirst,
    selectedSeconds,
    search,
    setSelectedFirst,
    setSelectedSeconds,
    setSearch,
    
    showSettings,
    setShowSettings,
    message,
    messageType,
    showMessage,
    
    themeMode,
    toggleTheme,
  }), [
    authenticated,
    user,
    myUid,
    othersUids,
    newUid,
    uids,
    playersMap,
    firstOptions,
    secondOptions,
    selectedFirst,
    selectedSeconds,
    search,
    showSettings,
    message,
    messageType,
    themeMode,
    toggleTheme,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error(
        'useAppContext must be used within an AppProvider'
    );
  }
  
  return context;
}
