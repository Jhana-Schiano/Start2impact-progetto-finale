import { Outlet } from "react-router";
import "./App.css";
import Header from "./components/Header/Index";
import Layout from "./components/Layout/Index";

function App() {
  return (
    <>
      <Header />
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
}

export default App;
