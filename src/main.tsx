import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// createRoot전에 mockging api 먼저 실행
async function enableMocking(): Promise<void> {
  // process.env.NODE_ENV
  if (import.meta.env.MODE !== "development") {
    return;
  }

  const worker = (await import("@/api/mocks/browser")).default; // 서비스 워커 임포트

  await worker.start(); // 서비스 워커 시작
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
