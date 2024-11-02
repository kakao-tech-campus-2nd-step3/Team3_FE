import { createContext, useState, useMemo, PropsWithChildren } from "react";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
}

interface AuthContextProps {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
  });

  // 객체 메모이제이션 처리
  const value = useMemo(() => ({ authState, setAuthState }), [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
