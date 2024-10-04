import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import LoginModal from "@/pages/LoginModal";
import PreviewPlanPage from "@/pages/PreviewPlan";
import VoicePage from "@/pages/Voice";
import PlanPage from "@/pages/Plan";
import FriendPage from "@/pages/Friend";
import MyPage from "@/pages/Mypage";
import Layout from "@/components/features/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // 공통 레이아웃 추가
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginModal /> },
      { path: "/plan/preview", element: <PreviewPlanPage /> },
      { path: "/voice", element: <VoicePage /> },
      { path: "/plan", element: <PlanPage /> },
      { path: "/friend", element: <FriendPage /> },
      { path: "/mypage", element: <MyPage /> },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
