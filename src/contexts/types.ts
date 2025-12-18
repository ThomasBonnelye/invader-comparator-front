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
 * Auth status type
 */
export type AuthStatus = 'CONNECTED' | 'GUEST' | null;

/**
 * Authentication Context Type
 */
export interface AuthContextType {
  authStatus: AuthStatus;
  user: User | null;

  continueAsGuest: () => void;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  migrateGuestData: () => Promise<void>;
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
  updateMyUid: (uidValue?: string) => Promise<void>;
  addOtherUid: () => Promise<void>;
  removeOtherUid: (uid: string) => Promise<void>;
  uids: string[];
  playersMap: Record<string, PlayerData>;
  loadUids: () => Promise<void>;
  loadPlayers: () => Promise<void>;
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
