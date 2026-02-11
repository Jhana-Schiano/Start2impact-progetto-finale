import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Clienti from "./areas/Clienti/Index";
import Profilo from "./areas/Profilo/Index";
import Palestra from "./areas/Palestra/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        path: "clienti",
        element: <Clienti />,
      },
      {
        path: "profilo",
        element: <Profilo />,
      },
      {
        path: "palestra",
        element: <Palestra />,
      }
    ]
  },
  {
    path: "*",
    element: <h1>404 - No page found!</h1>,
  },
]);

export default router;
