import CustomRender from "./CustomRender";
import React, { useState } from "react";
import { Button } from "beautiful-react-ui";

import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";

import Background from "./casa.png";
import Legend from "../legend/Legend";

const categories = ["sensors", "motors", "microcontroller"];
const colors = ["red", "green", "yellow"];

let i = 0;
let x = 0;
let y = 0;

const UncontrolledDiagram = ({ types }) => {
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [nodesForCleanup, setNodesForCleanup] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const initalSchema = createSchema({
    nodes: [],
  });
  const [schema, { onChange, addNode, removeNode }] = useSchema(initalSchema);

  console.log(schema.nodes);

  const deleteNodeFromSchema = (id, fromOffer = false) => {
    const nodeToRemove = schema.nodes.find((node) => node.id === id);
    
    if(nodeToRemove) {
      removeNode(nodeToRemove);
    }
   

    if (!fromOffer) {
      let nodesToRemove = nodes;

      let result = nodesToRemove.find(
        ({ content }) => content === nodeToRemove.content
      );
      if (result.count > 0) {
        result.count--;
      } else {
        nodesToRemove = nodesToRemove.filter(
          ({ content }) => content !== nodeToRemove.content
        );
      }
      setNodes(nodesToRemove);
    } else {
      setNodes([]);
    }
  };

  const getCategoriesByType = async (type) => {
    const response = await fetch("http://localhost:8000/categories/" + type.id);

    const data = await response.json();
    setCategories(data.categories);

    if (data.categories.length === 0) {
      const response = await fetch(
        "http://localhost:8000/products?type=" + type.name
      );

      const data = await response.json();
      setProducts(data.products);
    }
  };

  const getProductsByCategory = async (category) => {
    const response = await fetch(
      "http://localhost:8000/products?category=" + category.name
    );

    const data = await response.json();

    setProducts(data.products);
  };

  const addNewNode = (type) => {
    const nextNode = {
      id: `node -${type.color}-${i}`,
      content: `${type.name}`,
      coordinates: [x + 100, y],
      render: CustomRender,
      data: { onClick: deleteNodeFromSchema },
      inputs: [{ id: `port-${i}` }],
      outputs: [{ id: `port-${i}` }],
    };

    addNode(nextNode);

    let nodesToAdd = nodes;
    let nodesToRemove = nodesForCleanup;

    const result = nodesToAdd.find(
      ({ content }) => content === nextNode.content
    );
    if (result) {
      result.count++;
      result.price = result.count * +type.list_price;
    } else {
      nodesToAdd.push({
        content: nextNode.content,
        count: 1,
        id: nextNode.id,
        productId: type.id,
        price: +type.list_price,
      });
    }

    nodesToRemove.push({
      content: nextNode.content,
      count: 1,
      id: nextNode.id,
      productId: type.id,
      price: +type.list_price,
    });

    setNodes(nodesToAdd);
    setNodesForCleanup(nodesToRemove);

    i++;
    //x = x + 100;
  };

  const onCleanNodes = () => {
    nodesForCleanup.map((node) => {
      deleteNodeFromSchema(node.id, true);
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <Button
          color="primary"
          icon="plus"
          onClick={() => {
            setIsAddClicked(!isAddClicked);
          }}
        >
          Add new node
        </Button>{" "}
        <br />
        {isAddClicked &&
          types &&
          types.types.map((type) => (
            <>
              <Button
                color="primary"
                icon="plus"
                onClick={() => {
                  //addNewNode(type.name);
                  getCategoriesByType(type);
                }}
              >
                {type.name}
              </Button>
              <br />
            </>
          ))}
        {isAddClicked &&
          categories.length != 0 &&
          categories.map((category) => (
            <>
              <Button
                color="primary"
                icon="minus"
                onClick={() => {
                  getProductsByCategory(category);
                }}
              >
                {category.name}
              </Button>
              <br />
            </>
          ))}
        {isAddClicked &&
          products.length != 0 &&
          products.map((product) => (
            <>
              <Button
                color="primary"
                icon="minus"
                onClick={() => {
                  addNewNode(product);
                }}
              >
                {product.name}
              </Button>
              <br />
            </>
          ))}
      </div>
      <div style={{ height: "60rem", width: "90rem" }}>
        <Diagram
          style={{
            backgroundImage: `url("${Background}")`,
            backgroundRepeat: "no-repeat",
          }}
          schema={schema}
          onChange={onChange}
        ></Diagram>
      </div>

      <Legend nodes={nodes} cleanNodes={onCleanNodes} />
    </div>
  );
};

export default UncontrolledDiagram;
