import { useState } from "react";
import { Form } from "react-router-dom";
import { getAuthToken } from "../../util/auth";

const ProjectList = ({ projects, addArea, selectProjectId, areaErrors, setAreaErrors }) => {
  const [addNew, setAddNew] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [error, setError] = useState(false);
  const [myProjects, setMyProjects] = useState(projects.projects);
  const [addNewArea, setAddNewArea] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [myArea, setMyArea] = useState("");
  const [myMap, setMyMap] = useState(null);


  const onAddAreaClick = (event) => {
    setAddNewArea(!addNewArea);
  };

  const onAdNewClick = () => {
    setAddNew(!addNew);
    setError("");
  };

  const onChangeProjectInput = (event) => {
    setNewProject(event.target.value);
    setError("");
  };

  const onAddClick = async () => {
    const token = getAuthToken();

    const response = await fetch("http://localhost:8000/projects", {
      method: "POST",
      body: JSON.stringify({
        name: newProject,
      }),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message + " " + data.data[0].msg);
    } else {
      const data = await response.json();

      const newProjects = [...myProjects];
      newProjects.push(data.project);

      setMyProjects(newProjects);
      setNewProject("");
      setError("");
    }
  };

  const deleteProject = async (event) => {
    const token = getAuthToken();

    const response = await fetch(
      "http://localhost:8000/projects/" + event.target.id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );

    const newProjects = myProjects.filter((prj) => {
      return +prj.id !== +event.target.id;
    });

    setMyProjects(newProjects);
    setError("");
  };

  const selectProject = (id) => {
    setSelectedProject(id);
    selectProjectId(id);
  };

  const onChangeAreaHandler = async (event) => {
    setMyArea(event.target.value);
  };

  const addAreaHandler = async () => {
    addArea(myArea, selectedProject, myMap);   
    setMyArea(""); 
    const myFile = document.getElementById("map");
    myFile.value = "";
    setAreaErrors([])
};

  const onChangeMapHandler = (event) => {
    setMyMap(event.target.files[0]);
  }
  return (
    <>
      <ul style={{ listStyleType: "none" }}>
        <h2>
          Projects <button onClick={onAdNewClick}>Add new</button>
        </h2>{" "}
        <br />
        {areaErrors && <p>{areaErrors}</p>}
        {error && <p>{error}</p>}
        {addNew && (
          <>
            <input
              type="text"
              value={newProject}
              onChange={onChangeProjectInput}
            ></input>{" "}
            <button onClick={onAddClick}>Add</button>
          </>
        )}
        {myProjects &&
          myProjects.map((project) => (
            <li
              key={project.id}
              onClick={() => selectProject(project.id)}
              style={{ padding: "4px" }}
            >
              {selectedProject === +project.id && <> {"->"} </>}
              <button>{project.name}</button>{" "}
              <button
                style={{ color: "red" }}
                id={project.id}
                onClick={deleteProject}
              >
                delete
              </button>
              <button style={{ backgroundColor: "green", color: "white" }}>
                Edit
              </button>{" "}
              <button
                style={{ backgroundColor: "blue", color: "white" }}
                onClick={onAddAreaClick}
              >
                Add area
              </button>{" "}
              {addNewArea && selectedProject === +project.id && (
                <>
                  <input
                    placeholder="name"
                    name="map"
                    value={myArea}
                    onChange={onChangeAreaHandler}
                  ></input>{" "}
                  <input type="file" id="map" onChange={onChangeMapHandler}></input>{" "}
                  <button onClick={addAreaHandler}>Add</button>
                </>
              )}
            </li>
          ))}
      </ul>
    </>
  );
};

export default ProjectList;
