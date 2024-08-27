import { useState } from "react";
import { getAuthToken } from "../../util/auth";
import Modal from "react-modal";
import { Zoom } from "react-reveal";

import classes from "./AreaList.module.css";

const AreaList = ({ areas, setAreas, editArea }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [myArea, setMyArea] = useState("");
  const [myMap, setMyMap] = useState(null);
  const [myProject, setMyProject] = useState(null);
  const [areaId, setAreaId] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const deleteArea = async (id) => {
    const token = getAuthToken();

    const response = await fetch(`${BASE_URL}/projects/area/` + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    const areaDeleted = await response.json();
    console.log(areaDeleted.area_id);

    const newAreas = areas.filter((area) => {
      return +area.id !== areaDeleted.area_id;
    });

    setAreas(newAreas);
  };

  const openEditAreaModal = (id) => {
    setModalOpen(true);
    setMyArea(areas[id].name)
    setMyProject(areas[id].project_id);
    setAreaId(areas[id].id);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onChangeAreaHandler = (event) => {
    setMyArea(event.target.value);
  };

  const onChangeMapHandler = (event) => {
    setMyMap(event.target.files[0]);
  };

  const editAreaHandler = () => {
    editArea(myArea, myProject, myMap, areaId);
    setModalOpen(false);
  };

  let i = 0;
  return (
    <>
      <Modal isOpen={modalOpen} style={{content: {top:"50%", left:"50%"}}}>
        <Zoom>
          <button style={{ backgroundColor: "red" }} onClick={closeModal}>
            x
          </button>
          <div className={classes.form}>
          <input
            placeholder="name"
            name="map"
            value={myArea}
            onChange={onChangeAreaHandler}
          ></input>{" "}
          <input type="file" id="map" onChange={onChangeMapHandler}></input>{" "}
          <button style={{backgroundColor: "green", color:"white"}} onClick={editAreaHandler}>Modify</button>
          </div>
        </Zoom>
      </Modal>
      <h2>Areas</h2>
      <ul>
        {areas &&
          areas.length !== 0 &&
          areas.map((area) =>{
            const key = i;
          
            i++;
            return (
            <li style={{ padding: "4px" }}>
              {area.name}, {area.image}{" "}
              <button
                style={{ backgroundColor: "red", color: "white" }}
                onClick={() => {
                  deleteArea(area.id);
                }}
              >
                delete
              </button>{" "}
              <button
                style={{ backgroundColor: "green", color: "white" }}
                onClick={() => {
                  openEditAreaModal(key);
                }}
              >
                edit
              </button>
            </li>
          )})}
      </ul>
    </>
  );
};

export default AreaList;
