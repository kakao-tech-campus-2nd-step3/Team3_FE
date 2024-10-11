import { useQuery, QueryKey } from "@tanstack/react-query";
import { apiClient } from "../instance";

// Types
interface Friend {
  friend_id: number;
  friend_name: string;
  friend_profile_image: string;
  created_at: string;
}

interface SentRequest {
  id: number;
  receiver_id: number;
  receiver_name: string;
  status: string;
}

interface ReceivedRequest {
  id: number;
  requester_id: number;
  requester_name: string;
  status: string;
}

interface SearchResult {
  id: number;
  nickname: string;
  profile_image: string;
}

// 친구 목록을 가져오는 API 요청 함수
export const fetchFriends = async (): Promise<Friend[]> => {
  const response = await apiClient.get('/friends');
  return response.data;
};

// 받은 친구 요청 목록을 가져오는 API 요청 함수
export const fetchReceivedRequests = async (): Promise<ReceivedRequest[]> => {
  const response = await apiClient.get('/friends/requests/received');
  return response.data;
};

// 보낸 친구 요청 목록을 가져오는 API 요청 함수
export const fetchSentRequests = async (): Promise<SentRequest[]> => {
  const response = await apiClient.get('/friends/requests/sent');
  return response.data;
};

// 친구 목록을 가져오는 훅
export const useGetFriends = () => {
  return useQuery<Friend[], Error>({
    queryKey: ['friends'],  // queryKey를 객체의 속성으로 전달
    queryFn: fetchFriends,  // 데이터를 가져오는 함수
  });
};

// 받은 요청을 가져오는 훅
export const useGetReceivedRequests = () => {
  return useQuery<ReceivedRequest[], Error>({
    queryKey: ['receivedRequests'],  // queryKey를 객체 내에 명시
    queryFn: fetchReceivedRequests,  // queryFn에 데이터를 가져오는 함수 할당
  });
};

// 보낸 요청을 가져오는 훅
export const useGetSentRequests = () => {
  return useQuery<SentRequest[], Error>({
    queryKey: ['sentRequests'],  // queryKey를 객체 내에 명시
    queryFn: fetchSentRequests,  // queryFn에 데이터를 가져오는 함수 할당
  });
};


