// src/api/instance/index.ts
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { QueryClient } from "@tanstack/react-query";
import EventEmitter from "events";
// BASE URL 설정
const API_URL = import.meta.env.VITE_API_URL;
// 쿠키에서 특정 토큰을 가져오는 로직
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export const authEventEmitter = new EventEmitter();

// Axios 인스턴스 초기화 함수
const initInstance = (axiosConfig: AxiosRequestConfig = {}): AxiosInstance => {
  const accessToken = getCookie("access_token");
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...axiosConfig.headers,
    },
  });

  // 응단 인터셉터 설정
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        // 쿠키에서 리프레시 토큰 가져오기
        const refreshToken = getCookie("refresh_token");
        const deviceId = getCookie("device_id");

        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${API_URL}/api/token/refresh?refreshToken=${refreshToken}&deviceId=${deviceId}`,
            );
            const newAccessToken = data;

            // 새로운 액세스 토큰을 쿠키에 저장
            document.cookie = `access_token=${newAccessToken}; path=/; Secure; SameSite=Strict`;

            // Axios 인스턴스와 요청 헤더에 새로운 액세스 토큰 설정
            instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return await instance(originalRequest);
          } catch (refreshError) {
            console.error("리프레시 토큰 갱신 실패:", refreshError);
            authEventEmitter.emit("logout");
          }
        } else {
          authEventEmitter.emit("logout");
        }
      }
      return Promise.reject(error);
    },
  );
  return instance;
};

// Axios 인스턴스 생성 및 내보내기
export const apiClient = initInstance();
export const apiBaseUrl = apiClient.defaults.baseURL;

// QueryClient 생성 (전역적으로 사용할 수 있는 데이터 관리 객체)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});
