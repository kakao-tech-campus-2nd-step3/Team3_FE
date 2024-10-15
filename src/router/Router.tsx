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
import PrivateRoute from "./PrivateRoute";

function Router() {
  const router = createBrowserRouter([
    {
      path: RouterPath.HOME,
      element: <Layout />,
      children: [
        {
          path: RouterPath.HOME,
          element: <LandingPage />,
        },
        {
          path: RouterPath.MAIN,
          element: (
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          ),
        },
        { path: RouterPath.LOGIN, element: <LoginModal /> },
        {
          path: RouterPath.PREVIEW_PLAN,
          element: <PreviewPlanPage />,
        },
        {
          path: RouterPath.TEAM_PLAN,
          element: (
            <PrivateRoute>
              <TeamPlan />
            </PrivateRoute>
          ),
        },
        {
          path: RouterPath.PLAN,
          element: (
            <PrivateRoute>
              <PlanPage />
            </PrivateRoute>
          ),
        },
        {
          path: RouterPath.FRIEND,
          element: (
            <PrivateRoute>
              <FriendPage />
            </PrivateRoute>
          ),
        },
        {
          path: RouterPath.MY_PAGE,
          element: (
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
