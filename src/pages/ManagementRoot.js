import { Outlet } from "react-router-dom";
import ManagementNavigation from "../components/navigation/ManagementNavigation";

const ManagementRootPage = () => {
  return (
    <>
      <ManagementNavigation />
      <Outlet />
    </>
  );
};

export default ManagementRootPage;
