import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  isAuthenticated,
}) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
