import {
  createContext,
  useState,
  useMemo,
  PropsWithChildren,
  useEffect,
} from "react";
import { authEventEmitter } from "@/api/instance";

interface AuthState {
  isAuthenticated: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren<object>) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // 로컬 스토리지에서 초기 인증 상태를 가져옴
    const storedAuthState = localStorage.getItem("authState");
    return storedAuthState
      ? JSON.parse(storedAuthState)
      : { isAuthenticated: false };
  });

  useEffect(() => {
    // Listen for logout event
    const handleLogout = () => {
      setAuthState({ isAuthenticated: false });
      localStorage.removeItem("authState");
    };

    authEventEmitter.on("logout", handleLogout);

    return () => {
      authEventEmitter.off("logout", handleLogout);
    };
  }, []);

  useEffect(() => {
    // authState가 변경될 때마다 로컬 스토리지에 저장
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  const value = useMemo(() => ({ authState, setAuthState }), [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
