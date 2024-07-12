
import { NavLink } from 'react-router-dom';
import classes from './ManagementNavigation.module.css'; 

const ManagementNavigation = () => {

    return (
        <header>
        <nav>
          <ul className={classes.header}>
            <nav className={classes.list} style={{}}>
              <li>
                <NavLink
                    style={{color: "white", backgroundColor: "green", padding: "10px"}}
                  to=""
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  end
                >
                  Products
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to={`/properties/user/${userId}`}
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  end
                >
                  My properties
                </NavLink>
              </li> */}
              <li>
                <NavLink
                style={{color: "white", backgroundColor: "green", padding: "10px"}}
                  to="projects"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  end
                >
                  Projects
                </NavLink>
              </li>
            </nav>
          </ul>
        </nav>
      </header>
    )
}

export default ManagementNavigation;