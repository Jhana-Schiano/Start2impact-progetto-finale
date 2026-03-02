import "./MainLayout.css";
import { Header, Menu } from "../Index";  
import type { FC, PropsWithChildren } from "react";

const MainLayout: FC<PropsWithChildren> = (props) => {
  return (
    <>
      <Header />
      <Menu>{props.children}</Menu>
    </>
  );
};

export default MainLayout;
