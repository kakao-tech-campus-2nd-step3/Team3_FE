/* eslint-disable react-refresh/only-export-components */
import React, {
  useState,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import { Cookies } from "react-cookie";

// 쿠키에서 토큰 가져오기
const cookies = new Cookies();
const acceessTokenFromCookies = cookies.get("authToken");
const refreshTokenFromCookies = cookies.get("refreshToken");

// Context
export const LoginContext = React.createContext<any>(null);

// Provider
export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    acceessTokenFromCookies || null,
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    refreshTokenFromCookies || null,
  );
  const [Authenticated, setIsAuthenticated] = useState<boolean>(!!accessToken);

  // 토큰을 쿠키에 저장하는 login 함수
  const login = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);

    cookies.set("authToken", newAccessToken, { path: "/", maxAge: 3600 });
    cookies.set("refreshToken", newRefreshToken, { path: "/", maxAge: 604800 });
  };

  // 로그아웃 함수
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);

    cookies.remove("authToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
  };

  // 쿠키에서 토큰이 있는지 확인해서 인증 상태 설정
  useEffect(() => {
    setIsAuthenticated(!!accessToken);
  }, [accessToken]);

  // useMemo로 value 객체를 캐싱하며 매 랜더링 시 동일한 참조값을 유지
  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      Authenticated,
      setIsAuthenticated,
      login,
      logout,
    }),
    [accessToken, refreshToken, Authenticated],
  );

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLoginContext LoginProvider안에서 사용가능합니다.");
  }
  return context;
};
