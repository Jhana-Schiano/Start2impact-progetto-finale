import { createBrowserRouter, Outlet } from "react-router-dom";
import { ClientiPage, PalestraPage, ProfiloPage } from "./areas/Index";
import { MainLayout } from "./components/Index";
import LoginPage from "./areas/Auth/LoginPage";
import RegisterPage from "./areas/Auth/RegisterPage";
import RequireAuth from "./auth/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <ClientiPage />,
      },
      {
        path: "clienti",
        element: <ClientiPage />,
      },
      {
        path: "profilo",
        element: <ProfiloPage />,
      },
      {
        path: "palestra",
        element: <PalestraPage />,
      },
    ],
  },
  {
    path: "*",
    element: <h1>404 - No page found!</h1>,
  },
]);

export default router;
