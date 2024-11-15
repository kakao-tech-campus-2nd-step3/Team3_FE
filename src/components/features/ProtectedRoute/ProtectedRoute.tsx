import { Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { authState } = useAuth();
  return authState.isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
