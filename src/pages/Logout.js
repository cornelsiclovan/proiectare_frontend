import { redirect } from "react-router-dom";

export const action = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("workingAreaId");
  localStorage.removeItem("selectedProject")
  
  return redirect("/");
};
