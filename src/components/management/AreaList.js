import { getAuthToken } from "../../util/auth";

const AreaList = ({ areas, setAreas }) => {

  const deleteArea = async (id) => {
    const token = getAuthToken();

    const response = await fetch(
      "http://localhost:8000/projects/area/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
   
    const areaDeleted = await response.json();
    console.log(areaDeleted.area_id)

    const newAreas = areas.filter((area) => {
        return +area.id !== areaDeleted.area_id;
    });
    
    setAreas(newAreas);
  }

  return (
    <>
      <h2>Areas</h2>
      <ul>
        {areas &&
          areas.length !== 0 &&
          areas.map((area) => (
            <li style={{padding: "4px"}}>
              {area.name}, {area.image} 
              {" "}
              <button style={{backgroundColor: "red", color: "white"}} onClick={() => {deleteArea(area.id)}}>delete</button>
              {" "}
              <button style={{backgroundColor: "green", color: "white"}}>edit</button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default AreaList;
