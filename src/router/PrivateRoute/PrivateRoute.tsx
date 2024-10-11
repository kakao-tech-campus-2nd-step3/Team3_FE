import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
  CheckAuth: () => Promise<boolean>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, CheckAuth }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authResult = await CheckAuth();
        setIsAuthenticated(authResult);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    verifyAuth();
  }, [CheckAuth]);

  if (isAuthenticated === null) {
    return <div>Loading</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
