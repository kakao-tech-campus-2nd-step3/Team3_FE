import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import RouterPath from "@/router/RouterPath";
import { apiClient } from "@/api/instance";

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const { setAuthState, authState } = useAuth();

  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = queryParams.get("access");
      const refreshToken = queryParams.get("refresh");
      const deviceId = queryParams.get("deviceId");

      if (accessToken && refreshToken) {
        const cookieOptions = "path=/; Secure; SameSite=Strict;";

        // 토큰을 쿠키에 저장
        document.cookie = `access_token=${accessToken}; ${cookieOptions}`;
        document.cookie = `refresh_token=${refreshToken}; ${cookieOptions}`;
        document.cookie = `device_id=${deviceId}; ${cookieOptions}`;
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        // 상태 업데이트
        
        const newAuthState = {
          isAuthenticated: true,
        };
        setAuthState(newAuthState);
        localStorage.setItem("authState", JSON.stringify(newAuthState));
        // axios 인스턴스 헤더에 토큰 추가
        
      
      } else {
        // 토큰이 없으면 메인 페이지로 리다이렉트
        navigate(RouterPath.HOME);
      }
    } catch (error) {
      console.error("OAuth 리다이렉트 처리 중 오류 발생:", error);
      navigate(RouterPath.HOME);
    }
  }, [navigate, setAuthState]);

  // authState가 업데이트되었을 때 메인 페이지로 리다이렉트
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
      console.log("현재 access_token:", cookieValue);
        navigate(RouterPath.MAIN);
     
  }, [authState, navigate]);

  return <div>리다이렉트 처리 중...</div>;
};

export default OAuthRedirectHandler;
