import { useEffect } from "react";
import { requestForToken, setupOnMessageListener } from "@/api/firebaseConfig";
import { apiClient } from "@/api/instance";

// 전역 상태
let isInitialized = false;
let fcmTokenRegistered = false;

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
              await apiClient.post("/api/fcm/register", { token: fcmToken });
              fcmTokenRegistered = true;
            }
          }
        }

        setupOnMessageListener();
        console.log("FCM initialization complete");
      }
    };

    initializeFCM();
  }, []);
};

export default useNotificationSetup;
