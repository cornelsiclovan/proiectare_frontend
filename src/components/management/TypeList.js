import { useEffect, useState } from "react";
import { getAuthToken } from "../../util/auth";

const TypeList = ({ types, getCategoriesByTypeName, setCategoryId }) => {
  const [selectedType, setSelectedType] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [newTypes, setNewTypes] = useState(types ? types.types : []);
  const [error, setError] = useState(null);

  const onClickType = (event) => {
    getCategoriesByTypeName(event.target.value, event.target.innerText);
    setCategoryId(null);
    setSelectedType(event.target.value);
  };

  const handleTypeNameChange = (event) => {
    setTypeName(event.target.value);
    setError("");
  };

  const addType = async () => {
    const token = getAuthToken();
    setError("");

    const response = await fetch("http://localhost:8000/types", {
      method: "POST",
      body: JSON.stringify({
        name: typeName,
      }),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message);
    } else {
      const data = await response.json();

      console.log(newTypes);

      const myTypes = [...newTypes];
      myTypes.push(data.type);

      setNewTypes(myTypes);
      setTypeName("");
    }
  };

  const deleteTypeHandler = async (id) => {
    const token = getAuthToken();
    const response = await fetch("http://localhost:8000/types/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if(!response.ok) {
      const data = await response.json();
      setError(data.message);
    } else {
      const myTypes = newTypes.filter(type => type.id !== id);
      setNewTypes(myTypes);
      setError("");
    }

  };

  return (
    <>
      <div style={{ marginLeft: "4rem" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <b>
          Types <button onClick={() => setAddNew(!addNew)}>Add new</button>
        </b>
        <br />
        {addNew && (
          <>
            Name{" "}
            <input
              type="text"
              value={typeName}
              onChange={handleTypeNameChange}
            ></input>{" "}
            <button onClick={addType}>Add</button>
          </>
        )}
      </div>

      <ul style={{ listStyleType: "none" }}>
        {newTypes &&
          newTypes.map((type) => (
            <li>
              <button
                style={
                  +type.id === +selectedType
                    ? { backgroundColor: "red", color: "white" }
                    : {}
                }
                onClick={onClickType}
                value={type.id}
              >
                {type.name}
              </button>
              <button
                onClick={() => deleteTypeHandler(type.id)}
                style={{ color: "red" }}
              >
                delete
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default TypeList;
