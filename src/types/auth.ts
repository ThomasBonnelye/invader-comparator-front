export interface User {
  googleId: string;
  email: string;
  name: string;
}

export type AuthState = {
  authenticated: boolean;
  user: User | null;
};

export type AuthActions = {
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
};
