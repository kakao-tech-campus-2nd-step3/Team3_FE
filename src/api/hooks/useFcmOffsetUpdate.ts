import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../instance";

interface FcmOffsetUpdateRequest {
  token: string;
  notificationOffset: number;
}

type FcmOffsetUpdateResponse = string;

const useFcmOffsetUpdate = () => {
  return useMutation<FcmOffsetUpdateResponse, Error, FcmOffsetUpdateRequest>({
    mutationFn: async (data: FcmOffsetUpdateRequest) => {
      const response = await apiClient.put<FcmOffsetUpdateResponse>(
        "/api/fcm/update/notification-offset",
        {
          token: data.token,
          notificationOffset: data.notificationOffset,
        },
      );
      return response.data;
    },
    onError: (error) => {
      console.error("FCM 알림 오프셋 업데이트 실패:", error);
    },
  });
};

export default useFcmOffsetUpdate;
