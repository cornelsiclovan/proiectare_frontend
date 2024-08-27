import { useEffect, useState } from "react";
import { getAuthToken } from "../../util/auth";
import Modal from "react-modal";

import classes from "./AreaList.module.css";

const ProductList = ({
  products,
  typeId,
  categoryId,
  categories,
  addProducts,
}) => {
  const [addNew, setAddNew] = useState(false);
  const [error, setError] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [importModal, setImportModal] = useState(false);
  const [myDataFile, setMyDataFile] = useState(null);

  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [discClass, setDiscClass] = useState("");
  const [modelNr, setModelNr] = useState("");
  const [buspow, setBuspow] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [diam, setDiam] = useState("");
  const [price, setPrice] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    setMyProducts([...products]);
  }, [products]);

  const onAddNew = () => {
    setAddNew(!addNew);
  };

  const handleChange = (event) => {
    if ((event.target.name === "prodName")) {
      setProdName(event.target.value);
    }

    if (event.target.name === "prodDesc") {
      setProdDesc(event.target.value)
    }

    if(event.target.name=== "discClass") {
      setDiscClass(event.target.value);
    }

    if(event.target.name === "modelNr") {
      setModelNr(event.target.value);
    }

    if(event.target.name === "buspow") {
      setBuspow(event.target.value);
    }

    if(event.target.name === "height") {
      setHeight(event.target.value);
    }

    if(event.target.name === "width") {
      setWidth(event.target.value);
    }

    if(event.target.name === "depth") {
      setDepth(event.target.value);
    } 

    if(event.target.name ==="diam") {
      setDiam(event.target.value);
    }

    if(event.target.name === "price") {
      setPrice(event.target.value);
    }
  };

  const addProduct = async () => {
    const token = getAuthToken();

    if (categoryId) {
      const response = await fetch(`${BASE_URL}/products/one`, {
        method: "POST",
        body: JSON.stringify({
          name: prodName,
          typeId: typeId,
          categoryId: categoryId,
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
        console.log(data.product);
        const myprods = [...myProducts];
        myprods.push(data.product);
        console.log(myprods);
        setMyProducts(myprods);
      }
    } else {
      if (categories.length === 0) {
        const response = await fetch(`${BASE_URL}/products/one`, {
          method: "POST",
          body: JSON.stringify({
            name: prodName,
            typeId: typeId,
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
          console.log(data.product);
          const myprods = [...myProducts];
          myprods.push(data.product);
          console.log(myprods);
          setMyProducts(myprods);
        }
      } else {
        setError("Please select a category!");
      }
    }
  };

  const onDeleteProductHandler = async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/products/` + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message);
    } else {
      const myprods = [...myProducts.filter((mprod) => mprod.id !== id)];
      setMyProducts(myprods);
    }
  };

  const onImportClick = () => {
    setImportModal(!importModal);
  };

  const closeModal = () => {
    setImportModal(false);
  };

  const onChangeFileHandler = (event) => {
    setMyDataFile(event.target.files[0]);
  };

  const addData = () => {
    addProducts(myDataFile);
    setImportModal(false);
  };
  return (
    <>
      <Modal
        isOpen={importModal}
        style={{ content: { top: "50%", left: "50%" } }}
      >
        <button style={{ backgroundColor: "red" }} onClick={closeModal}>
          x
        </button>
        <div className={classes.form}>
          <input
            type="file"
            id="data-import"
            onChange={onChangeFileHandler}
          ></input>{" "}
          <button
            style={{ backgroundColor: "green", color: "white" }}
            onClick={addData}
          >
            Add
          </button>
        </div>
      </Modal>
      <ul style={{ listStyleType: "none" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <b>
          Products <button onClick={onAddNew}>Add new</button>{" "}
          <button onClick={onImportClick}>Import from exel</button>
        </b>

        <br />
        {addNew && (
          <>
            Name{" "}
            <input
              type="text"
              value={prodName}
              name="prodName"
              onChange={handleChange}
            ></input>{" "}
            <br/>
            Desc {""}
            <input
              type="text"
              value={prodDesc}
              name="prodDesc"
              onChange={handleChange}
            ></input>{" "}
            <br/>
            Discount Class {""}
            <input
              type="text"
              value={discClass}
              name="discClass"
              onChange={handleChange}
            ></input>{" "}
             <br/>
             Model nr.
             <input
              type="text"
              value={modelNr}
              name="modelNr"
              onChange={handleChange}
            ></input>{" "}
            <br/>
            Bus power
            <input
              type="text"
              value={buspow}
              name="buspow"
              onChange={handleChange}
            ></input>{" "}
            <br/>
           Height
            <input
              type="text"
              value={height}
              name="height"
              onChange={handleChange}
            ></input>{" "}
            <br/>
            Width
            <input
              type="text"
              value={width}
              name="width"
              onChange={handleChange}
            ></input>{" "}
            <br/>
            Depth
            <input
              type="text"
              value={depth}
              name="depth"
              onChange={handleChange}
            ></input>{" "}
            <br/>
            Diameter
            <input
              type="text"
              value={diam}
              name="diam"
              onChange={handleChange}
            ></input>{" "}
            <br/>
            Price
            <input
              type="text"
              value={price}
              name="price"
              onChange={handleChange}
            ></input>{" "}
            <br/>
          
            <button onClick={addProduct}>Add</button>
          </>
        )}
        {myProducts &&
          myProducts.map((product) => (
            <li key={product.id}>
              <button>{product.name}</button>
              <button
                style={{ color: "red" }}
                onClick={() => {
                  onDeleteProductHandler(product.id);
                }}
              >
                delete
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default ProductList;
