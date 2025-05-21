import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "~/pages/Auth/Login";
import Register from "~/pages/Auth/Register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Chill đi các brother</div>,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
