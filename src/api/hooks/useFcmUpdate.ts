import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

interface UpdateNotificationEnabledRequest {
  token: string;
  isNotificationEnabled: boolean;
}

export const useUpdateNotificationEnabled = () => {
  return useMutation({
    mutationFn: async ({
      token,
      isNotificationEnabled,
    }: UpdateNotificationEnabledRequest) => {
      const response = await apiClient.put(
        `/api/fcm/update/notification-enabled?token=${token}&isNotificationEnabled=${isNotificationEnabled}`,
        {}, // 빈 body
        {
          withCredentials: true,
        },
      );

      return response.data;
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        console.error("인증 정보가 없거나 만료되었습니다.");
      } else {
        console.error("알림 설정 업데이트 실패:", error);
      }
    },
  });
};

export default useUpdateNotificationEnabled;
