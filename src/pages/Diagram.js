import { Suspense } from "react";
import {
  Await,
  json,
  redirect,
  useSubmit,
} from "react-router-dom";
import UncontrolledDiagram from "../components/diagram/UncontrolledDiagram";
import { getAuthToken } from "../util/auth";

const DiagramLayout = () => {
  const token = getAuthToken();
 
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

const BASE_URL = process.env.REACT_APP_BASE_URL;

const loadTypes = async () => {
  const token = getAuthToken();

  
  
  const response = await fetch(`${BASE_URL}/types`, {
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
  const token = getAuthToken();

  if (!token || token === "EXPIRED") {
    return redirect("/auth?mode=login");
  }

  return {
    types: await loadTypes(),
  };
};
