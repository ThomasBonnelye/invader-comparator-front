import { type PlayerData } from '../api/spaceInvaders';

/**
 * User interface for authentication
 */
export interface User {
  googleId: string;
  email: string;
  name: string;
}

/**
 * Dropdown option interface
 */
export interface Option {
  label: string;
  value: string;
}

/**
 * Authentication Context Type
 */
export interface AuthContextType {
  authenticated: boolean;
  user: User | null;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
}

/**
 * Players Context Type
 */
export interface PlayersContextType {
  myUid: string;
  othersUids: string[];
  newUid: string;
  setMyUid: (uid: string) => void;
  setNewUid: (uid: string) => void;
  updateMyUid: () => Promise<void>;
  addOtherUid: () => Promise<void>;
  removeOtherUid: (uid: string) => Promise<void>;
  uids: string[];
  playersMap: Record<string, PlayerData>;
  firstOptions: Option[];
  secondOptions: Option[];
  loadUids: () => Promise<void>;
  loadPlayers: () => Promise<void>;
}

/**
 * Filter Context Type
 */
export interface FilterContextType {
  selectedFirst: string;
  selectedSeconds: string[];
  search: string;
  setSelectedFirst: (value: string) => void;
  setSelectedSeconds: (values: string[]) => void;
  setSearch: (value: string) => void;
}

/**
 * UI Context Type
 */
export interface UIContextType {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  message: string;
  messageType: 'success' | 'error';
  showMessage: (text: string, type: 'success' | 'error') => void;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}
