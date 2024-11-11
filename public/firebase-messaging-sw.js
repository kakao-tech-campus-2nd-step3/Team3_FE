importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

// 환경 변수에서 Firebase 설정값 가져오기
firebase.initializeApp({
  apiKey: "AIzaSyAInigygScRLDilnWcnArBN8LMbQRpDZVk",
  authDomain: "splanet-cef14.firebaseapp.com",
  projectId: "splanet-cef14",
  storageBucket: "splanet-cef14.appspot.com",
  messagingSenderId: "995362943401",
  appId: "1:995362943401:web:cef434d0e3f51d31a4d4b8",
  measurementId: "G-LZJKRYBSJV",
});

const messaging = firebase.messaging();

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png", // 아이콘 이미지 경로
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
