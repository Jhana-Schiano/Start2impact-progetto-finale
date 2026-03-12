import "./MainLayout.css";
import { Header, Menu } from "../Index";
import type { FC, PropsWithChildren } from "react";
import useLogout from "../../auth/useLogout";

const MainLayout: FC<PropsWithChildren> = (props) => {
  const handleLogout = useLogout();

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
