import { useState } from "react";

const TypeList = ({ types, getCategoriesByTypeName }) => {
  const [selectedType, setSelectedType] = useState("");

  const onClickType = (event) => {
    getCategoriesByTypeName(event.target.value, event.target.innerText);
    console.log(event.target.value);
    setSelectedType(event.target.value);
  };

  return (
    <>
      <ul style={{listStyleType: "none"}}>
        <b>Types <button>Add new</button></b>
        {types &&
          types.types &&
          types.types.map((type) => (
            <li>
              <button  style={ +type.id === +selectedType ? {backgroundColor: "red", color: "white"} : {}} onClick={onClickType} value={type.id}>
                {type.name}
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default TypeList;
