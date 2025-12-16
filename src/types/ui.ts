export type ThemeMode = 'light' | 'dark';

export type UIState = {
  showSettings: boolean;
  message: string;
  messageType: 'success' | 'error';
  themeMode: ThemeMode;
};

export type UIActions = {
  setShowSettings: (show: boolean) => void;
  showMessage: (text: string, type: 'success' | 'error') => void;
  toggleTheme: () => void;
};
