import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useLoginContext } from "@/provider/Auth";

const PrivateRoute = ({
  children,
}: PropsWithChildren<{ children: React.ReactElement }>) => {
  const { Authenticated } = useLoginContext();

  if (Authenticated === null) {
    return <div>Loading</div>;
  }

  return Authenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
