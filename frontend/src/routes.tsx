import { createBrowserRouter } from "react-router-dom";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        path: "clienti",
        element: <h1>Clienti</h1>,
      },
      {
        path: "profilo",
        element: <h1>Profilo</h1>,
      },
      {
        path: "palestra",
        element: <h1>Palestra</h1>,
      }
    ]
  },
  {
    path: "*",
    element: <h1>404 - No page found!</h1>,
  },
]);

export default router;
