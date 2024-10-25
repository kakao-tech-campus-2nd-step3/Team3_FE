// src/interceptors/authInterceptor.ts
import axios from "axios";
import { apiClient, apiBaseUrl } from "../api/instance";

// 쿠키에서 특정 토큰 값을 가져오는 함수
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

// Axios 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 쿠키에서 리프레시 토큰 가져오기
      const refreshToken = getCookie("refresh_token");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiBaseUrl}/token/refresh`, {
            refresh_token: refreshToken,
          });
          const newAccessToken = data;

          // 새로운 액세스 토큰을 쿠키에 저장
          document.cookie = `access_token=${newAccessToken}; path=/; Secure; SameSite=Strict`;

          // Axios 인스턴스와 요청 헤더에 새로운 액세스 토큰 설정
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return await apiClient(originalRequest);
        } catch (refreshError) {
          console.error("리프레시 토큰 갱신 실패:", refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);
