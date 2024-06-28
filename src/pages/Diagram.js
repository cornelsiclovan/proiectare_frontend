import { Suspense } from "react";
import {
  Await,
  defer,
  json,
  redirect,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";
import UncontrolledDiagram from "../components/diagram/UncontrolledDiagram";

const DiagramLayout = () => {
  const types = loader() || {};
  
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading ...</p>}>
      <Await resolve={types}>
        {(loadedTypes) => <UncontrolledDiagram types={loadedTypes} />}
      </Await>
    </Suspense>
  );
};

export default DiagramLayout;

const loadTypes = async () => {
  const response = await fetch("http://localhost:8000/types");

  if (!response.ok) {
    throw json({ message: "Could not fetch product types" }, { status: 500 });
  } else {
    const resData = await response.json();

    // console.log(resData.types);

    return resData.types;
  }
};

export const loader = async () => {
  return {
    types: await loadTypes(),
  };
};
