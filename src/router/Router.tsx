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
import PrivateRoute from "@/router/PrivateRoute/PrivateRoute";

function Router() {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

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
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MainPage />
            </PrivateRoute>
          ),
        },
        { path: RouterPath.login, element: <LoginModal /> },
        { path: RouterPath.previewPlan, element: <PreviewPlanPage /> },
        {
          path: RouterPath.teamPlan,
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TeamPlan />
            </PrivateRoute>
          ),
        },
        {
          path: RouterPath.plan,
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <PlanPage />
            </PrivateRoute>
          ),
        },
        {
          path: RouterPath.friend,
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <FriendPage />
            </PrivateRoute>
          ),
        },
        {
          path: RouterPath.myPage,
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
