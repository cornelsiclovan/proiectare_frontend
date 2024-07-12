import RecoverPasswordForm from "../components/authentication/RecoverPasswordForm";
import { json, redirect } from "react-router-dom";

const RecoverPasswordPage = () => {
  return <RecoverPasswordForm />;
};

export const action = async ({ request }) => {
  const data = await request.formData();
  const confirmPassword = {
    resetToken: data.get("confirmResetToken"),
    password: data.get("newPassword"),
    repeatPassword: data.get("repeatPassword")
  };

  const response = await fetch("http://localhost:8000/new-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(confirmPassword),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not reset password." }, { status: 500 });
  }

  const resData = await response.json();

  return redirect("/auth?mode=login");
};

export default RecoverPasswordPage;
