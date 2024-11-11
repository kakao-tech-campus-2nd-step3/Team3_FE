import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// // createRoot전에 mockging api 먼저 실행
// async function enableMocking(): Promise<void> {
//   // process.env.NODE_ENV
//   // if (import.meta.env.MODE !== "development") {
//   //   return;
//   // }

//   const { default: worker } = await import("@/api/mocks/browser");

//   await worker.start(); // 서비스 워커 시작
// }

// enableMocking().then(() => {

// });
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker 등록 성공:", registration);
    })
    .catch((error) => {
      console.error("Service Worker 등록 실패:", error);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
