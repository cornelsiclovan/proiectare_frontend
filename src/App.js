import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import "beautiful-react-diagrams/styles.css";
import React, { useEffect, useState } from "react";
import { Button } from "beautiful-react-ui";

import UncontrolledDiagram from "./components/diagram/UncontrolledDiagram";
import Legend from "./components/legend/Legend";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import DiagramLayout, {loader as typesLoader} from "./pages/Diagram";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    id: "root",
    children: [
      {
        index: true,
        element: <DiagramLayout/>,
        loader: typesLoader,
        id: "types"
      }
    ]
  }
]);


function App() {
  return (
    // <div style={{ display: "flex" }}>
    //   <UncontrolledDiagram />
    // </div>
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
