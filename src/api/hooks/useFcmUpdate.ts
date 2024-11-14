import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { requestForToken, setupOnMessageListener } from "@/api/firebaseConfig";
import { apiClient } from "@/api/instance";

const FCM_TOKEN_KEY = "fcm_token";

// FCM 토큰을 서버에 등록하는 함수
const registerFcmToken = async (
  token: string,
): Promise<AxiosResponse<any, any>> => {
  return apiClient.post("/api/fcm/register", { token });
};

const useNotificationSetup = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // FCM 토큰 등록에 대한 Mutation 설정
  const { mutateAsync, isError } = useMutation<
    AxiosResponse<any, any>,
    Error,
    string
  >(registerFcmToken);

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        const savedToken = localStorage.getItem(FCM_TOKEN_KEY);

        if (!savedToken) {
          console.log("Requesting FCM permission...");
          const permission = await Notification.requestPermission();

          if (permission === "granted") {
            const fcmToken = await requestForToken();

            if (fcmToken) {
              await mutateAsync(fcmToken); // 서버에 토큰 등록
              localStorage.setItem(FCM_TOKEN_KEY, fcmToken); // 토큰을 로컬에 저장
              console.log("FCM token registered successfully");
            } else {
              throw new Error("Failed to get FCM token");
            }
          } else {
            throw new Error("Notification permission denied");
          }
        }

        setupOnMessageListener(); // 메시지 리스너 설정
        setIsInitialized(true);
        console.log("FCM initialization complete");
      } catch (err) {
        console.error("FCM initialization failed:", err);
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
      }
    };

    if (!isInitialized) {
      initializeFCM();
    }

    return () => {
      // 필요한 경우 cleanup 로직 추가
    };
  }, [isInitialized, mutateAsync]);

  return { isInitialized, error, mutateAsync, isError }; // mutateAsync를 반환
};

export default useNotificationSetup;
