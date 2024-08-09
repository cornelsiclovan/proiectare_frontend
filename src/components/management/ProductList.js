import { useState } from "react";
import { getAuthToken } from "../../util/auth";

const ProductList = ({ products, typeId, categoryId }) => {
  const [addNew, setAddNew] = useState(false);
  const [prodName, setProdName] = useState("");

  const onAddNew = () => {
    setAddNew(!addNew);
  };

  const handleChange = (event) => {
    setProdName(event.target.value);
  };

  const addProduct = async () => {
    const token = getAuthToken();
    
    if (categoryId) {
      const response = fetch("http://localhost:8000/products/one", {
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
    } else {
      const response = fetch("http://localhost:8000/products/one", {
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
    }
  };

  return (
    <>
      <ul style={{ listStyleType: "none" }}>
        <b>
          Products <button onClick={onAddNew}>Add new</button>
        </b>
        <br />
        {addNew && (
          <>
            Name{" "}
            <input type="text" value={prodName} onChange={handleChange}></input>{" "}
            <button onClick={addProduct}>Add</button>
          </>
        )}
        {products &&
          products.map((product) => (
            <li>
              <button>{product.name}</button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default ProductList;
