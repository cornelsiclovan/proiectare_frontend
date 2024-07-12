import classes from "./AuthForm.module.css";
import { Form, useActionData, useNavigation } from "react-router-dom";

const RecoverPasswordForm = () => {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <>
      <Form method="post" className={classes.form}>
        {data && data.message && <p>{data.message}</p>}
        {data && data.data && (
          <>
            {data.data.map((err) => {
              console.log("---", err);
              return <p key={err.msg}>{err.msg}</p>;
            })}
          </>
        )}
        <p>
          <label htmlFor="confirmResetToken">Reset token</label>
          <input
            id="confirmResetToken"
            type="confirmResetToken"
            name="confirmResetToken"
          />
        </p>
        <p>
          <label htmlFor="newPassword">New Password</label>
          <input id="newPassword" type="newPassword" name="newPassword" />
        </p>
        <p>
          <label htmlFor="repeatPassword">Repeat Password</label>
          <input
            id="repeatPassword"
            type="repeatPassword"
            name="repeatPassword"
          />
        </p>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Save"}
        </button>
      </Form>
    </>
  );
};

export default RecoverPasswordForm;
