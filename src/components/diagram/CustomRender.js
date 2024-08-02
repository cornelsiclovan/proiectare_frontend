import React from "react";

const CustomRender = ({ id, content, data, inputs, outputs }) => {
  let color = "green";

  if (content === "sensors") {
    color = "red";
  }

  if (content === "microcontroller") {
    color = "yellow";
  }

  return (
    <div style={{ background: id.split("-")[1] }}>
      <div style={{ textAlign: "right" }}>
        <button style={{padding: "5px"}}  onClick={() => data.onClick(id)}>x</button>
      </div>
      <div role="button" style={{ padding: "5px" }}>
        
      </div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
        }} >
        {/* {inputs.map((port) => React.cloneElement(port, {style: { width: '25px', height: '25px', background: '#1B263B' }}))}
         {outputs.map((port) => React.cloneElement(port, {style: { width: '25px', height: '25px', background: '#1B263B' }}))} */}
        </div>
    </div>
  );
};

export default CustomRender;
