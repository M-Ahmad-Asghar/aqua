import React from "react";
import { RouterProvider } from "react-router-dom";
import { protectedRoutes } from "./protectedRoutes";

function Router() {
  return <RouterProvider router={protectedRoutes} />;
}

export default Router;
