// src/provider/useAuth.tsx
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

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

  // 객체 메모이제이션 처리
  const value = useMemo(() => ({ authState, setAuthState }), [authState]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
