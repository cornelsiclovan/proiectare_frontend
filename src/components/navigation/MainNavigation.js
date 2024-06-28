import classes from "./MainNavigation.module.css";
import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

const MainNavigation = () => {
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
          <li>
            <div style={{ display: "flex", gap: "1rem" }}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                style={{backgroundColor: "green", marginRight: "50px", paddingRight: "10px", paddingLeft: "10px", borderRadius: "2px"}}
              >
                Load
              </NavLink>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
