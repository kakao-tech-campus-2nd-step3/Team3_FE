// src/api/hooks/useLogin.ts
import axios from "axios";
import { useState } from "react";
import { apiClient } from "../instance";
import useAuth from "@/provider/useAuth";

const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const { setAuthState } = useAuth();

  const login = async () => {
    try {
      const response = await axios.post("https://kauth.kakao.com/oauth/token");
      const { access_token, refresh_token } = response.data;

      // access_token 쿠키에 저장 (Secure, SameSite 옵션 사용)
      document.cookie = `access_token=${access_token}; path=/; Secure; SameSite=Strict`;

      // refresh_token 쿠키에 저장 (Secure, SameSite 옵션 사용)
      document.cookie = `refresh_token=${refresh_token}; path=/; Secure; SameSite=Strict`;

      // 전역 상태 업데이트
      setAuthState({
        isAuthenticated: true,
        accessToken: access_token,
      });

      // 이후 요청에 사용할 Axios 인스턴스 헤더에 토큰 추가
      apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } catch (e) {
      setError(`로그인 실패: ${e}`);
    }
  };

  return { login, error };
};

export default useLogin;
