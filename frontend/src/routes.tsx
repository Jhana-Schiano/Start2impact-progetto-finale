import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import {
  ClientiPage,
  DatiClienteTab,
  DettaglioClientePage,
  LoginPage,
  PalestraPage,
  ProfiloPage,
  RegisterPage,
  Scheda,
  SchedeClienteTab,
} from "./areas/Index";
import { MainLayout } from "./components/Index";
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
        path: "clienti/:id",
        element: <DettaglioClientePage />,
        children: [
          {
            index: true,
            element: <Navigate to="dati" replace />,
          },
          {
            path: "dati",
            element: <DatiClienteTab />,
          },
          {
            path: "schede",
            element: <SchedeClienteTab />,
          },
          {
            path: "schede/:schedaId",
            element: <Scheda />,
          },
        ],
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
