import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { apiClient } from "@/api/instance";
import RouterPath from "@/router/RouterPath";

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
        // 상태 업데이트
        setAuthState({
          isAuthenticated: true,
          accessToken,
        });

        // axios 인스턴스 헤더에 토큰 추가
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        navigate(RouterPath.LOGIN);
      }
    } catch (error) {
      console.error("OAuth 리다이렉트 처리 중 오류 발생:", error);
      navigate(RouterPath.LOGIN);
    }
  }, [navigate, setAuthState]);

  // authState가 업데이트되었을 때 메인 페이지로 리다이렉트
  useEffect(() => {
    // console.log("현재 authState:", authState);
    if (authState.isAuthenticated) {
      navigate(RouterPath.MAIN);
    }
  }, [authState, navigate]);

  return <div>리다이렉트 처리 중...</div>;
};

export default OAuthRedirectHandler;
