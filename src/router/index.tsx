import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "@/pages/Landing";
import { RouterPath } from "./routerPath";
import LoginModal from "@/pages/LoginModal";
import PreviewPlanPage from "@/pages/PreviewPlan";
import TeamPlan from "@/pages/TeamPlan";
import PlanPage from "@/pages/Plan";
import FriendPage from "@/pages/Friend";
import MyPage from "@/pages/Mypage";
import { Layout } from "@/components/features/Layout";
import MainPage from "@/pages/Main";
import PrivateRoute from "@/components/common/PrivateRoute/PrivateRoute";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: RouterPath.home,
      element: <Layout />,
      children: [
        {
          path: RouterPath.home,
          element: <LandingPage />,
        },
        {
          path: RouterPath.main,
          element: <PrivateRoute element={<MainPage />} />,
        },
        { path: RouterPath.login, element: <LoginModal /> },
        { path: RouterPath.previewPlan, element: <PreviewPlanPage /> },
        {
          path: RouterPath.teamPlan,
          element: <PrivateRoute element={<TeamPlan />} />,
        },
        {
          path: RouterPath.plan,
          element: <PrivateRoute element={<PlanPage />} />,
        },
        {
          path: RouterPath.friend,
          element: <PrivateRoute element={<FriendPage />} />,
        },
        {
          path: RouterPath.myPage,
          element: <PrivateRoute element={<MyPage />} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
