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