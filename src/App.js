import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import "beautiful-react-diagrams/styles.css";
import React, { useEffect, useState } from "react";
import { Button } from "beautiful-react-ui";


import UncontrolledDiagram from "./components/diagram/UncontrolledDiagram";
import Legend from "./components/legend/Legend";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import DiagramLayout, { loader as typesLoader } from "./pages/Diagram";
import AuthenticationPage, {
  action as authAction,
} from "./pages/Authentication";
import { tokenLoader } from "./util/auth";
import { action as logoutAction } from "./pages/Logout";
import RecoverPasswordPage, {
  action as resetAction,
} from "./pages/RecoverPassword";
import ConfirmPage, { action as confirmAction } from "./pages/Confirm";
import ErrorPage from "./pages/Error";
import ManagementPage, { loader as managementLoader } from "./pages/Management";
import ManagementRootPage from "./pages/ManagementRoot";
import ProjectsPage from "./pages/Projects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <DiagramLayout />,
        loader: typesLoader,
        id: "types",
      },
      {
        path: "/management",
        element: <ManagementRootPage />,
        children: [
          {
            index: true,
            element: <ManagementPage />,
            loader: managementLoader,
          },
          {
            path: "projects",
            id: "projects",
            element: <ProjectsPage />,
          },
        ],
      },
      {
        path: "auth",
        element: <AuthenticationPage />,
        action: authAction,
      },
      {
        path: "confirm",
        element: <ConfirmPage />,
        action: confirmAction,
      },
      {
        path: "recover-password",
        element: <RecoverPasswordPage />,
        action: resetAction,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

const  App = () => {
  return (
    // <div style={{ display: "flex" }}>
    //   <UncontrolledDiagram />
    // </div>
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
