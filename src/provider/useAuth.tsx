// src/provider/useAuth.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
}

interface AuthContextProps {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
