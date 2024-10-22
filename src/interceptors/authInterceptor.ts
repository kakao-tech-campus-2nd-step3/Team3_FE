// src/interceptors/authInterceptor.ts
import axios from 'axios';
import { apiClient, apiBaseUrl } from '../api/instance';

// Axios 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiBaseUrl}/token/refresh`, {
            refresh_token: refreshToken,
          });
          const newAccessToken = data;

          // 새로운 액세스 토큰 설정 및 로컬 스토리지 업데이트
          localStorage.setItem('access_token', newAccessToken);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('리프레시 토큰 갱신 실패:', refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);