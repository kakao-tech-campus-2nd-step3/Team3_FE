import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "@/pages/Landing/Landing";
import { routerPath } from "./routerPath";
import LoginModal from "@/pages/LoginModal/LoginModal";
import PreviewPlanPage from "@/pages/PreviewPlan";
import TeamPlan from "@/pages/TeamPlan/TeamPlan";
import PlanPage from "@/pages/Plan/Plan";
import FriendPage from "@/pages/Friend/Friend";
import MyPage from "@/pages/Mypage/Mypage";
import { Layout } from "@/components/features/Layout/Layout";
import MainPage from "@/pages/Main/Main";
import PrivateRoute from "@/router/PrivateRoute/PrivateRoute";

function Router() {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  const router = createBrowserRouter([
    {
      path: routerPath.home,
      element: <Layout />,
      children: [
        {
          path: routerPath.home,
          element: <LandingPage />,
        },
        {
          path: routerPath.main,
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MainPage />
            </PrivateRoute>
          ),
        },
        { path: routerPath.login, element: <LoginModal /> },
        { path: routerPath.previewPlan, element: <PreviewPlanPage /> },
        {
          path: routerPath.teamPlan,
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TeamPlan />
            </PrivateRoute>
          ),
        },
        {
          path: routerPath.plan,
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <PlanPage />
            </PrivateRoute>
          ),
        },
        {
          path: routerPath.friend,
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <FriendPage />
            </PrivateRoute>
          ),
        },
        {
          path: routerPath.myPage,
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
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
