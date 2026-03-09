import "./MainLayout.css";
import { Header, Menu } from "../Index";
import type { FC, PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";

const MainLayout: FC<PropsWithChildren> = (props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="layout-shell">
      <Header onLogout={handleLogout} />
      <div className="layout-content">
        <Menu>{props.children}</Menu>
      </div>
    </div>
  );
};

export default MainLayout;
