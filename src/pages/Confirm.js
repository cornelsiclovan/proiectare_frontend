import { json, redirect } from "react-router-dom";
import ConfirmForm from "../components/authentication/ConfirmForm";


const ConfirmPage = () => {
  return <ConfirmForm />;
};

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const action = async ({ request }) => {
  const data = await request.formData();
  const confirmData = {
    registryToken: data.get("confirmToken"),
  };

  const response = await fetch(
    `${BASE_URL}/confirm-account-registry`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confirmData),
    }
  );

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not confirm user." }, { status: 500 });
  }

  const resData = await response.json();
  
  return redirect("/");
};

export default ConfirmPage;