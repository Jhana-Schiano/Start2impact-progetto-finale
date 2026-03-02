import { createBrowserRouter, Outlet } from "react-router-dom";
import { ClientiPage, PalestraPage, ProfiloPage } from "./areas/Index";
import { MainLayout } from "./components/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
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
