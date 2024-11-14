import { useEffect } from "react";
import { requestForToken, setupOnMessageListener } from "@/api/firebaseConfig";
import { apiClient } from "@/api/instance";

// 전역 상태
let isInitialized = false;
let fcmTokenRegistered = false;

const FCM_TOKEN_KEY = "fcm_token"; // 로컬 스토리지 키

const useNotificationSetup = () => {
  useEffect(() => {
    const initializeFCM = async () => {
      if (!isInitialized) {
        console.log("Initializing FCM...");
        isInitialized = true;

        if (!fcmTokenRegistered) {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const fcmToken = await requestForToken();
            if (fcmToken) {
              try {
                await apiClient.post("/api/fcm/register", { token: fcmToken });
                // 토큰을 로컬 스토리지에 저장
                localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
                fcmTokenRegistered = true;
                console.log("FCM token saved to localStorage:", fcmToken);
              } catch (error) {
                console.error("Failed to register FCM token:", error);
              }
            }
          }
        }

        setupOnMessageListener();
        console.log("FCM initialization complete");
      }
    };

    initializeFCM();
  }, []);

  // 토큰을 가져오는 유틸리티 함수 추가
  const getFCMToken = () => {
    return localStorage.getItem(FCM_TOKEN_KEY);
  };

  return {
    getFCMToken,
  };
};

export default useNotificationSetup;
