import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../instance";
import {
  Friend,
  SentRequest,
  ReceivedRequest,
  SearchResult,
} from "@/types/types";

// 친구 목록을 가져오는 API 요청 함수
export const fetchFriends = async (): Promise<Friend[]> => {
  const response = await apiClient.get("/friends");
  return response.data;
};

// 받은 친구 요청 목록을 가져오는 API 요청 함수
export const fetchReceivedRequests = async (): Promise<ReceivedRequest[]> => {
  const response = await apiClient.get("/friends/requests/received");
  return response.data;
};

// 보낸 친구 요청 목록을 가져오는 API 요청 함수
export const fetchSentRequests = async (): Promise<SentRequest[]> => {
  const response = await apiClient.get("/friends/requests/sent");
  return response.data;
};

// 친구 목록을 가져오는 훅
export const useGetFriends = () => {
  return useQuery<Friend[], Error>({
    queryKey: ["friends"], // queryKey를 객체의 속성으로 전달
    queryFn: fetchFriends, // 데이터를 가져오는 함수
  });
};

// 받은 요청을 가져오는 훅
export const useGetReceivedRequests = () => {
  return useQuery<ReceivedRequest[], Error>({
    queryKey: ["receivedRequests"], // queryKey를 객체 내에 명시
    queryFn: fetchReceivedRequests, // queryFn에 데이터를 가져오는 함수 할당
  });
};

// 보낸 요청을 가져오는 훅
export const useGetSentRequests = () => {
  return useQuery<SentRequest[], Error>({
    queryKey: ["sentRequests"], // queryKey를 객체 내에 명시
    queryFn: fetchSentRequests, // queryFn에 데이터를 가져오는 함수 할당
  });
};

// 닉네임으로 검색하기
export const useGetFriendByNickname = (nickname: string) => {
  return useQuery<SearchResult>({
    queryKey: ["friend", nickname],
    queryFn: async () => {
      const response = await apiClient.get(`/users/nickname/${nickname}`);
      return response.data;
    },
    enabled: false, // 항상 false로 설정하여 자동 실행 방지
    retry: false,
  });
};
