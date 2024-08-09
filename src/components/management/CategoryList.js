import { useEffect, useState } from "react";
import { getAuthToken } from "../../util/auth";

const CategoryList = ({ categories, getProductsByCategoryName, typeId, setCategoryId, categoryId}) => {
 
  const [addNew, setAddNew] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);
  const [myCategories, setMyCategories] = useState([]);

  useEffect(() => {
    setMyCategories([...categories]);
  }, [categories]);

  const onClickCategory = (event) => {
    getProductsByCategoryName(event.target.innerText);
    setCategoryId(event.target.value);
  };

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
    setError("");
  };

  const addCategory = async () => {
    const token = getAuthToken();

    const response = await fetch("http://localhost:8000/categories", {
      method: "POST",
      body: JSON.stringify({
        name: categoryName,
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
      const newCategories = [...myCategories];
      newCategories.push(data.category);
      setMyCategories([...newCategories]);
      setError("");
      setCategoryName("");
    }
  };

  const deleteCategoryHandler = async (id) => {
    const token = getAuthToken();
    const response = await fetch("http://localhost:8000/categories/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    if(!response.ok) {
      setError(data.message)
    }else{
      const newCategories = myCategories.filter(categ => categ.id !== id);
      setMyCategories(newCategories);
    }
  };

  return (
    <>
      <div style={{ marginLeft: "4rem" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <b>
          Categories <button onClick={() => setAddNew(!addNew)}>Add new</button>
        </b>
        <br />
        {addNew && (
          <>
            Name{" "}
            <input
              type="text"
              value={categoryName}
              onChange={handleCategoryNameChange}
            ></input>{" "}
            <button onClick={addCategory}>Add</button>
          </>
        )}
      </div>
      <ul style={{ listStyleType: "none" }}>
        {myCategories &&
          myCategories.map((category) => (
            <li>
              <button
                style={
                  +category.id === +categoryId
                    ? { backgroundColor: "red", color: "white" }
                    : {}
                }
                onClick={onClickCategory}
                value={category.id}
              >
                {category.name}
              </button>
              <button
                style={{ color: "red" }}
                onClick={() => deleteCategoryHandler(category.id)}
              >
                delete
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default CategoryList;
