import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./routes/root";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import Login from "./pages/login";
import Dashboard from "./routes/dahboard";
import Files from "./routes/files";
import Editor from "./routes/editor";
import Register from "./pages/register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/",
        element: <Login />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard/files",
        element: <Files />,
      },
      {
        path: "/dashboard/files/:id",
        element: <Editor />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
