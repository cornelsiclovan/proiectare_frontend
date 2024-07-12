import { useState } from "react";

const CategoryList = ({ categories, getProductsByCategoryName }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const onClickCategory = (event) => {
    getProductsByCategoryName(event.target.innerText);
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      <ul style={{listStyleType: "none"}}>
        <b>Categories <button>Add New</button></b>
        {categories &&
          categories &&
          categories.map((category) => (
            <li>
              <button
                style={
                  +category.id === +selectedCategory ? { backgroundColor: "red", color: "white" } : {}
                }
                onClick={onClickCategory}
                value={category.id}
              >
                {category.name}
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default CategoryList;
