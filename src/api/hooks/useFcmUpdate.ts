import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../instance";

interface FcmUpdateRequest {
  token: string;
  isNotificatioinEnabled?: boolean;
  notificationOffset?: number;
}

interface FcmUpdateResponse {
  message: string;
}

const useFcmUpdate = () => {
  return useMutation<FcmUpdateResponse, Error, FcmUpdateRequest>({
    mutationFn: async (data: FcmUpdateRequest) => {
      const response = await apiClient.put<FcmUpdateResponse>(
        "/api/fcm/update",
        {
          token: data.token,
          isNotificationEnabled: data.isNotificatioinEnabled ?? true,
          notificationOffset: data.notificationOffset ?? 0,
        },
      );
      return response.data;
    },
    onError: (error) => {
      console.error("FCM 토큰 업데이트 실패:", error);
    },
  });
};

export default useFcmUpdate;
