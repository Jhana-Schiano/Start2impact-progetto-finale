import "./MainLayout.css";
import { Header, Menu } from "../Index";  
import type { FC, PropsWithChildren } from "react";

const MainLayout: FC<PropsWithChildren> = (props) => {
  return (
    <div className="layout-shell">
      <Header />
      <div className="layout-content">
        <Menu>{props.children}</Menu>
      </div>
    </div>
  );
};

export default MainLayout;
