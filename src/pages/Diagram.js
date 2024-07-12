import { Suspense } from "react";
import {
  Await,
  json,
  redirect,
} from "react-router-dom";
import UncontrolledDiagram from "../components/diagram/UncontrolledDiagram";
import { getAuthToken } from "../util/auth";

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
  const token = getAuthToken();
  
  const response = await fetch("http://localhost:8000/types", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw json({ message: "Could not fetch product types" }, { status: 500 });
  } else {
    const resData = await response.json();

    // console.log(resData.types);

    return resData.types;
  }
};

export const loader = async () => {

  console.log("loader")
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth?mode=login");
  }

  return {
    types: await loadTypes(),
  };
};
