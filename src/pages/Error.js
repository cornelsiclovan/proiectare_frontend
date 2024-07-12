import { useRouteError } from "react-router-dom";
import PageContent from "../components/content/PageContent";

const ErrorPage = () => {
  const error = useRouteError();
   
   //console.log(document.location.href.includes('properties/new'));

  console.log(error);

  let title = "An error occured!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resurce or page.";
  }

  

  return (
    <>
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </>
  );
};

export default ErrorPage;
