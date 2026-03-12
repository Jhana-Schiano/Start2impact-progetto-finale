import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUserId } from "../store/authSlice";
import { useAppSelector } from "../store/hooks";

const useRequiredUserId = (): number | null => {
  const userId = useAppSelector(selectCurrentUserId);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userId === null) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [location.pathname, navigate, userId]);

  return userId;
};

export default useRequiredUserId;
