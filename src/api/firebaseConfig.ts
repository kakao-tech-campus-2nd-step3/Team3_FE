// src/api/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage as firebaseOnMessage } from 'firebase/messaging';

// 환경 변수에서 Firebase 설정값 가져오기
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// VAPID 키 가져오기
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// FCM 토큰 요청 함수
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('FCM token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    return null;
  }
};

// 메시지 수신 리스너 설정
export const setupOnMessageListener = () => {
  firebaseOnMessage(messaging, (payload) => {
    console.log("Message received: ", payload);

    const notificationTitle = payload.notification?.title || "알림";
    const notificationOptions = {
      body: payload.notification?.body || "새로운 알림이 도착했습니다.",
    };

    // 브라우저 알림 표시
    new Notification(notificationTitle, notificationOptions);
  });
};

export { messaging };
