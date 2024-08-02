import { Button } from "beautiful-react-ui";
import { useState } from "react";

const Legend = ({ nodes, cleanNodes, saveArea }) => {
  const [total, setTotal] = useState(0);

  let curentTotal = 0

  const makeOffer = async () => {
    const sendBody = { offer: nodes };

    const response = await fetch("http://localhost:8000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendBody),
    });

    const data = await response.json();

    cleanNodes();
  };

  const save = async () => {
    saveArea();
  };
  return (
    <>
      <ul style={{ listStyleType: "no-bullets" }}>
        {" "}
        {nodes.map((node) => {
          let color = "green";

          
          curentTotal += +node.price;
          
          // console.log(node.count !== 0);
          if (node.count !== 0)
            return (
              <li>
                <span
                  style={{ fontSize: "30px", color: node.id.split("-")[1] }}
                >
                  &#9632;
                </span>
                {node.content}: <b> {node.count}</b>
              </li>
            );
        })}
        <b style={{fontSize: "20px"}}>Total: {curentTotal} $</b>
        {nodes.length !== 0 && (
          <div style={{ display: "flex" }}>
            <button
              style={{ color: "white", backgroundColor: "green" }}
              onClick={makeOffer}
            >
              Export
            </button>
            <button
              style={{ color: "white", backgroundColor: "#003b95" }}
              onClick={save}
            >
              Save
            </button>
          </div>
        )}
      </ul>
    </>
  );
};

export default Legend;
