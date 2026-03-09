import type { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

type LocationState = {
  from?: string;
};

const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const userId = useAppSelector((state) => state.auth.userId);
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!userId) {
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
