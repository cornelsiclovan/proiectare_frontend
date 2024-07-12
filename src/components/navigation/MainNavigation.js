import classes from "./MainNavigation.module.css";
import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

const MainNavigation = () => {
  const { token } = useRouteLoaderData("root");
  return (
    <header className={classes.header}>
      <nav style={{ maxWidth: "100%" }}>
        <ul
          className={classes.list}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {" "}
          <li>
            <div style={{ display: "flex", gap: "1rem" }}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Home
              </NavLink>
            </div>
          </li>
          {token && (
            <li>
              <div style={{ display: "flex", gap: "1rem" }}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  style={{
                    backgroundColor: "green",

                    paddingRight: "10px",
                    paddingLeft: "10px",
                    borderRadius: "2px",
                  }}
                >
                  Load
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  to="/management"
                >
                  Management
                </NavLink>
              </div>
            </li>
          )}
          <li style={{ marginRight: "100px" }}>
            {!token && (
              <NavLink
                to="/auth?mode=login"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Login
              </NavLink>
            )}
            {token && (
              <Form action="/logout" method="post">
                <button style={{ color: "white" }}>Logout</button>
              </Form>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
