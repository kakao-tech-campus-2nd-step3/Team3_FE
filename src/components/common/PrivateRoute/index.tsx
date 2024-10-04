import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
