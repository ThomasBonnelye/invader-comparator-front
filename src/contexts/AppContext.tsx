import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {

  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [myUid, setMyUid] = useState('');
  const [othersUids, setOthersUids] = useState<string[]>([]);
  const [uids, setUids] = useState<string[]>([]);
  const [playersMap, setPlayersMap] = useState<Record<string, PlayerData>>({});

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // async functions for authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include',
        });
        
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
  }, []);

  // async functions for UIDs and players loading
  const loadUids = async () => {
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
  };

  // async function to load players data
  const loadPlayers = async () => {
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
  };

  // UI state management
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };
}