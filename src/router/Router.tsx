import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "@/pages/Landing/LandingPage";
import RouterPath from "./RouterPath";
import LoginModal from "@/pages/LoginModal/LoginModal";
import PreviewPlanPage from "@/pages/PreviewPlan/PreviewPlanPage";
import TeamPlan from "@/pages/TeamPlan/TeamPlan";
import PlanPage from "@/pages/Plan/PlanPage";
import FriendPage from "@/pages/Friend/FriendPage";
import MyPage from "@/pages/Mypage/Mypage";
import Layout from "@/components/features/Layout/Layout";
import MainPage from "@/pages/Main/MainPage";
import FriendDetailPage from "@/pages/Friend/FriendDetailPage";
import useAuth from "@/provider/useAuth";
import { Navigate } from 'react-router-dom';
import TeamPlanDetailPage from "@/pages/TeamPlan/TeamPlanDetail";
function Router() {
  const { authState } = useAuth();
  const router = createBrowserRouter([
    {
      path: RouterPath.home, // 랜딩 페이지는 사이드바 없는 레이아웃
      element: <LandingPage />,
    },
    {
      path: RouterPath.login, 
      element: <LoginModal />,
    },
    {
      path: RouterPath.previewPlan, 
      element: <PreviewPlanPage />,
    },
    {
      path: '/',
      element: authState.isAuthenticated ? <Layout /> : <Navigate to={RouterPath.login} />,
      children: [
        { path: RouterPath.main, element: <MainPage /> },
        { path: RouterPath.teamPlan, element: <TeamPlan /> },
        {
          path: `${RouterPath.teamPlan}/:teamId`,
          element: <TeamPlanDetailPage />,
        },
        { path: RouterPath.myPage, element: <MyPage /> },
        { path: RouterPath.plan, element: <PlanPage /> },
        {
          path: RouterPath.friend,
          element: <FriendPage />,
        },
        {
          path: `${RouterPath.friend}/:friendId`,
          element: <FriendDetailPage />,
        },
        { path: RouterPath.myPage, element: <MyPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;