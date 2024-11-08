// src/api/hooks/useFriendRequest.ts
import { useState } from "react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

export const useFriendRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendFriendRequest = async (receiverId: number) => {
    setIsLoading(true);
    try {
      await apiClient.post("/api/friends/requests", { receiverId });
      alert("친구 요청이 전송되었습니다.");
      setError(null); // 이전 에러 상태 초기화
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 400) {
        alert("이미 친구 요청을 보냈습니다.");
      } else {
        setError("친구 요청 전송 중 오류가 발생했습니다.");
        console.error("친구 요청 오류:", axiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { sendFriendRequest, error, isLoading };
};

export const useAcceptFriendRequest = (requestId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient.post(`/api/friends/requests/${requestId}/accept`),
    onSuccess: () => {
      alert("친구 요청을 수락했습니다.");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] }); // 친구 요청 목록 갱신
    },
  });
};

export const useRejectFriendRequest = (requestId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient.post(`/api/friends/requests/${requestId}/reject`),
    onSuccess: () => {
      alert("친구 요청을 거절했습니다.");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] }); // 친구 요청 목록 갱신
    },
  });
};

export const useCancelFriendRequest = (requestId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/friends/requests/${requestId}/cancel`);
    },
    onSuccess: () => {
      alert("친구 요청이 취소되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] }); // 보낸 요청 목록 갱신
    },
    onError: (error) => {
      console.error("친구 요청 취소 중 오류가 발생했습니다:", error);
      alert("친구 요청을 취소하는 데 실패했습니다.");
    },
  });
};
