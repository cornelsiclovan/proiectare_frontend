import { Button } from "beautiful-react-ui";
import { useEffect, useState } from "react";
import { getAuthToken } from "../../util/auth";

const Legend = ({
  nodes,
  cleanNodes,
  saveArea,
  nodesCount,
  selectedProject,
  showOffer,
  setShowOffer
}) => {
  const [total, setTotal] = useState(0);
  

  const exportToExcel = (offerData) => {
    var csvString = "Echipament, Buc, Pret, Valoare";
    csvString += "\r\n";

    offerData.forEach((rowItem) => {
      if (+rowItem.count > 0) {
        csvString +=
          rowItem.content.split("-")[1] +
          ", " +
          rowItem.count +
          ", " +
          rowItem.list_price +
          ", " +
          rowItem.list_price * rowItem.count;
        csvString += "\r\n";
      }
    });

    csvString =
      "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(csvString);
    const x = document.createElement("A");
    x.setAttribute("href", csvString);
    x.setAttribute("download", "somedata.csv");
    document.body.appendChild(x);
    x.click();
  };

  useEffect(() => {
    console.log("useeffect");
    let currTotal = 0;

    nodes.map((node) => {
      currTotal += +node.list_price;
    });

    setTotal(+currTotal);
  }, [nodes, nodesCount]);

  const makeOffer = async () => {
    const sendBody = { offer: nodes };
    const token = getAuthToken();

    const response = await fetch(
      "http://localhost:8000/prodsToAreas/project/" + selectedProject,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await response.json();
    console.log(data);

    let offerData = [];

    data.productsInProject.map((prod) => {
      let exists = false;
      offerData.map((oD) => {
        if (oD.product_id === prod.product_id) {
          oD.count = +oD.count + 1;
          exists = true;
        }
      });

      if (!exists) {
        prod.count = 1;
        offerData.push(prod);
      }
    });

    exportToExcel(offerData);
    // const token = getAuthToken();

    // const response = await fetch("http://localhost:8000/projects/offer", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + token,
    //   },
    //   body: JSON.stringify(sendBody),
    // });

    // const data = await response.json();

    // cleanNodes();
  };

  const save = async () => {
    saveArea();
  };

  return (
    <>
    <button onClick={() => setShowOffer(!showOffer)} style={{backgroundColor: "red", color: "white", padding: "10px", height: "50px"}}>
      {showOffer? "<<": ">>"}
    </button>
    <div style={{display: showOffer? "none": ""}}>

      <ul style={{ listStyleType: "no-bullets" }}>
        {" "}
        {nodes.map((node) => {
          if (node.count !== 0)
            return (
              <li key={node.id}>
                <span
                  style={{ fontSize: "30px", color: node.id.split("-")[1] }}
                >
                  &#9632;
                </span>
                {node.content}: <b> {node.count}</b>
              </li>
            );
        })}
        <b style={{ fontSize: "20px" }}>Total: {total} $</b>
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
    </div>
    </>
  );
};

export default Legend;
