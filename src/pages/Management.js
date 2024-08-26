import { Suspense } from "react";
import TypeList from "../components/management/TypeList";
import { getAuthToken } from "../util/auth";
import { Await, json, redirect } from "react-router-dom";
import React, { useState } from "react";
import CategoryList from "../components/management/CategoryList";
import ProductList from "../components/management/ProductList";

const ManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const types = loader() || [];
  const token = getAuthToken();
  const [typeId, setTypeId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const getCategoriesByTypeName = async (typeId, typeName) => {
    setTypeId(typeId);
    const response = await fetch("http://localhost:8000/categories/" + typeId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    setCategories(data.categories);

    if (data && data.categories && data.categories.length === 0) {
      const response = await fetch(
        "http://localhost:8000/products?type=" + typeName,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();

      setProducts(data.products);
    } else {
      setProducts([]);
    }
  };

  const getProductsByCategoryName = async (category) => {
    const response = await fetch(
      "http://localhost:8000/products?category=" + category,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await response.json();

    setProducts(data.products);
  };

  const addProducts = async (file) => {
    const token = getAuthToken();
    const formData = new FormData();

    formData.append("docs", file);

    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });


    if(!response.ok) {
      console.log(await response.json().message);

    }else {
      console.log(await response.json());
    }

    
    return redirect("/management");
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div style={{ flex: 1 }}>
        <Suspense fallback={<p style={{ textAlign: "center" }}>Loading ...</p>}>
          <Await resolve={types}>
            {(loadedTypes) => (
              <TypeList
                types={loadedTypes}
                getCategoriesByTypeName={getCategoriesByTypeName}
                setCategoryId={setCategoryId}
              />
            )}
          </Await>
        </Suspense>
      </div>
      <div style={{ flex: 1 }}>
        {" "}
        {categories && (
          <CategoryList
            categories={categories}
            getProductsByCategoryName={getProductsByCategoryName}
            typeId={typeId}
            setCategoryId={setCategoryId}
            categoryId={categoryId}
          />
        )}
      </div>
      <div style={{ flex: 1 }}>
        {products && (
          <ProductList
            products={products}
            typeId={typeId}
            categoryId={categoryId}
            categories={categories}
            addProducts={addProducts}
          />
        )}
      </div>
    </div>
  );
};

const loadTypes = async () => {
  const token = getAuthToken();

  const response = await fetch("http://localhost:8000/types", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw json({ message: "Could not fetch product types" }, { status: 500 });
  } else {
    const resData = await response.json();

    //console.log(resData.types);

    return resData.types;
  }
};

export const loader = async () => {
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth?mode=login");
  }

  return {
    types: await loadTypes(),
  };
};

export default ManagementPage;
