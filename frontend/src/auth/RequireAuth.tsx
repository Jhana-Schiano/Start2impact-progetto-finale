import type { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../store/authSlice";
import { useAppSelector } from "../store/hooks";

type LocationState = {
  from?: string;
};

const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: state?.from ?? location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
