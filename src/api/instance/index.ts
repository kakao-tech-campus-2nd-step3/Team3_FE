// src/api/instance/index.ts
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

// Axios 인스턴스 생성
// axios.create()를 통해 기본 설정
export const apiClient = axios.create({
  baseURL: "https://api.splanet.co.kr/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiBaseUrl = apiClient.defaults.baseURL; // msw에서 쓸려고

// QueryClient 생성 (전역적으로 사용할 수 있는 데이터 관리 객체)
export const queryClient = new QueryClient();
