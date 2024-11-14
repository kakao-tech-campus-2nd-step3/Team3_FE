import { useEffect, useRef } from "react";
import { requestForToken, setupOnMessageListener } from "@/api/firebaseConfig";
import { apiClient } from "@/api/instance";

const FCM_TOKEN_KEY = "fcm_token";

// 모듈 레벨에서 전역 플래그 선언
let isTokenRequestedGlobal = false;

const useNotificationSetup = () => {
  const tokenRequestedRef = useRef(false);

  useEffect(() => {
    const initializeFCM = async () => {
      // 이미 토큰 요청이 진행 중이거나 완료된 경우 중복 실행 방지
      if (isTokenRequestedGlobal || tokenRequestedRef.current) {
        return;
      }

      try {
        isTokenRequestedGlobal = true; // 전역 플래그 설정
        tokenRequestedRef.current = true;

        const existingToken = localStorage.getItem(FCM_TOKEN_KEY);
        if (!existingToken) {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const fcmToken = await requestForToken();
            if (fcmToken) {
              await apiClient.post("/api/fcm/register", { token: fcmToken });
              localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
              console.log("New FCM token registered and saved:", fcmToken);
            }
          }
        }

        // 메시지 리스너는 한 번만 설정
        setupOnMessageListener();
      } catch (error) {
        console.error("Failed to initialize FCM:", error);
        // 에러 발생 시 다음 시도를 위해 플래그 초기화
        isTokenRequestedGlobal = false;
        tokenRequestedRef.current = false;
      }
    };

    initializeFCM();

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      tokenRequestedRef.current = false;
    };
  }, []);

  const getFCMToken = () => {
    return localStorage.getItem(FCM_TOKEN_KEY);
  };

  return {
    getFCMToken,
  };
};

export default useNotificationSetup;
