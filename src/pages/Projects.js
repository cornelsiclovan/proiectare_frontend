import { getAuthToken } from "../util/auth";
import ProjectList from "../components/management/ProjectList";
import { Await, json, redirect } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import AreaList from "../components/management/AreaList";


const BASE_URL = process.env.REACT_APP_BASE_URL;

const ProjectsPage = () => {
  const projects = loader() || [];
  const token = getAuthToken();
  const [selectedProject, setSelectedProject] = useState(null);
  const [areas, setAreas] = useState([]);
  const [areaErrors, setAreaErrors] = useState("");



  useEffect(() => {
    const fetchAreas = async () => {
      const response = await fetch(
        `${BASE_URL}/projects/` + selectedProject + "/areas",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();
      setAreas(data.areas);
    };

    fetchAreas();
  }, [selectedProject]);

  const addArea = async (myArea, selectedProject, map) => {
    const token = getAuthToken();
    const formData = new FormData();

    formData.append("name", myArea);
    formData.append("projectId", selectedProject);
    formData.append("map", map);

    const response = await fetch(`${BASE_URL}/projects/area`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      setAreaErrors(data.message + " " + data.data[0].msg);
    } else {
      const data = await response.json();

      const myAreas = [...areas];
      
      
      myAreas.push(data.area);

      setAreas(myAreas);

      return data;
    }
  };

  const editArea = async (myArea, selectedProject, map, areaID) => {
    const token = getAuthToken();
    const formData = new FormData();

    formData.append("name", myArea);
    formData.append("projectId", selectedProject);
  
    if (map) {
      
      formData.append("map", map);
    }

    const response = await fetch(`${BASE_URL}/projects/area/`+areaID, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data)
      setAreaErrors(data.message);
    } else {
      const data = await response.json();

      const myAreas = [...areas];

      myAreas.map(area => {
        if(area.id === areaID) {
          area.name = data.area.name;
          area.image = data.area.image;
        }
      })

      //myAreas.push(data.area);

      setAreas(myAreas);

      return data;
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div style={{ flex: 1 }}>
        <Suspense fallback={<p style={{ textAlign: "center" }}>Loading ...</p>}>
          <Await resolve={projects}>
            {(loadedProjects) => (
              <ProjectList
                projects={loadedProjects}
                addArea={addArea}
                selectProjectId={setSelectedProject}
                areaErrors={areaErrors}
                setAreaErrors={setAreaErrors}
              />
            )}
          </Await>
        </Suspense>
      </div>
      <div style={{ flex: 1 }}>
        <AreaList
          areas={areas}
          areaErrors={areaErrors}
          setAreas={setAreas}
          editArea={editArea}
        />
      </div>
    </div>
  );
};

const loadProjects = async () => {
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}/projects`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw json({ message: "Could not fetch projects" }, { status: 500 });
  } else {
    const resData = await response.json();

    return resData.projects;
  }
};

export const loader = async () => {
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth?mode=login");
  }

  return {
    projects: await loadProjects(),
  };
};

export default ProjectsPage;
