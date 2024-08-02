import CustomRender from "./CustomRender";
import React, { useEffect, useState } from "react";
import { Button } from "beautiful-react-ui";
import Modal from "react-modal";

import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";

import Background from "./casa.png";
import Legend from "../legend/Legend";
import { getAuthToken } from "../../util/auth";
import { useNavigate } from "react-router-dom";

const categories = ["sensors", "motors", "microcontroller"];
const colors = ["red", "green", "yellow"];

let i = 0;
let x = 0;
let y = 0;

const UncontrolledDiagram = ({ types }) => {
  const navigate = useNavigate();

  const [isAddClicked, setIsAddClicked] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [nodesForCleanup, setNodesForCleanup] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [projectArea, setProjectArea] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectAreas, setProjectAreas] = useState([]);
  const [workingAreaId, setWorkingAreaId] = useState(
    localStorage.getItem("workingAreaId")
      ? localStorage.getItem("workingAreaId")
      : null
  );

  const initalSchema = createSchema({
    nodes: [],
  });

  const [schema, { onChange, addNode, removeNode }] = useSchema(initalSchema);

  //console.log(schema.nodes);

  const myProducts = [];

  useEffect(() => {

    const fetchCurrentWorkingArea = async () => {
      
      schema.nodes.map((node) => {
        removeNode(node);
      });

      const token = getAuthToken();

      const response = await fetch(
        "http://localhost:8000/prodsToAreas/" + workingAreaId,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();

      let j = 0;
      data.productsInArea.map((p) => {
        let prod = {};
        prod.id = p.product_id;
        prod.color = p.node_id.split("-")[1];
        prod.name = p.content.split("-")[1];
        prod.x = p.orizontal;
        prod.y = p.vertical;
        prod.node_id = p.node_id;
        addNewNode(prod, true);
        j = +prod.node_id.split("-")[2] + 1;
        myProducts.push(p);
      });
      i = j;
    };

    const fetchArea = async () => {
    
      const token = getAuthToken();
      try {
        const response = await fetch(
          "http://localhost:8000/areas/" + workingAreaId,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.json();
        //console.log(data);
        setProjectArea(data.area);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentWorkingArea();

    if (workingAreaId) {
      fetchArea();
    }
  }, [workingAreaId]);

  useEffect(() => {
    if (modalOpen && !selectedProject) {
      
      const fetchProjects = async () => {
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/projects", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await response.json();
        setProjects(data.projects);
      };

      fetchProjects();
    } else if (selectedProject) {
      
      const fetchAreas = async () => {
        const token = getAuthToken();
        const response = await fetch(
          "http://localhost:8000/projects/" + selectedProject + "/areas",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();

        setProjectAreas(data.areas);
      };

      fetchAreas();
    } else {
      setProjects([]);
      setProjectAreas([]);
      console.log("close");
    }
  }, [modalOpen, selectedProject]);

  const closeModal = () => {
    setModalOpen(false);
    navigate("/");
  };

  const deleteNodeFromSchema = async (id, fromOffer = false) => {
    const token = getAuthToken();
    const nodeToRemove = schema.nodes.find((node) => node.id === id);

    console.log(myProducts);
    console.log(id);

    if (myProducts.length > 0) {
      const prodToRemove = myProducts.filter((prod) => prod.node_id === id);

      console.log(prodToRemove[0].id);

      const response = await fetch(
        "http://localhost:8000/prodsToAreas/" + prodToRemove[0].id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();
      console.log(data);
    }

    if (nodeToRemove) {
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
    const token = getAuthToken();
    const response = await fetch(
      "http://localhost:8000/categories/" + type.id,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await response.json();
    setCategories(data.categories);

    if (data && data.categories && data.categories.length === 0) {
      const response = await fetch(
        "http://localhost:8000/products?type=" + type.name,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();
      setProducts(data.products);
    }
  };

  const getProductsByCategory = async (category) => {
    const token = getAuthToken();
    const response = await fetch(
      "http://localhost:8000/products?category=" + category.name,
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

  const addNewNode = (type, oldNode) => {
    let coordX = type.x || x + 100;
    let coordY = type.y || y;
    let node_identifier = `node -${type.color}-${i}`;

    if (oldNode) {
      node_identifier = type.node_id;
    }
    const nextNode = {
      id: node_identifier,
      content: `${type.id}-${type.name}`,
      coordinates: [coordX, coordY],
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

  const loadProjectAreaHandler = () => {
    setModalOpen(true);
  };

  const selectArea = (area) => {
    setWorkingAreaId(area.id);
    localStorage.setItem("workingAreaId", area.id);
    setProjectArea(area);
  };

  const saveArea = async () => {
    const token = getAuthToken();
    const sendBody = { products: schema.nodes };

    console.log(projectArea.id);

    const response = await fetch(
      "http://localhost:8000/prodsToAreas/" + projectArea.id,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendBody),
      }
    );

    let data = await response.json();
  };

  return (
    <>
      <Modal isOpen={modalOpen} onRequestClose={closeModal}>
        {" "}
        <button style={{ backgroundColor: "red" }} onClick={closeModal}>
          x
        </button>
        <div style={{ display: "flex" }}>
          <ul>
            <h1>Projects</h1>
            {projects &&
              projects.map((project) => (
                <li>
                  <button
                    onClick={() => {
                      setSelectedProject(project.id);
                    }}
                  >
                    {project.name}
                  </button>
                </li>
              ))}
            <h1>Areas</h1>
            {projectAreas &&
              projectAreas.map((pa) => (
                <li>
                  <button
                    onClick={() => {
                      selectArea(pa);
                    }}
                  >
                    {pa.name}
                  </button>
                </li>
              ))}
            <button
              style={{ color: "white", backgroundColor: "green" }}
              onClick={() => {
                setModalOpen(false);
              }}
            >
              ok
            </button>
          </ul>
          {projectArea && (
            <img src={`http://localhost:8000/${projectArea.image}`}></img>
          )}
        </div>
      </Modal>
      <div style={{ display: "flex" }}>
        <div>
          <div>
            <button
              style={{
                color: "white",
                backgroundColor: "green",
                margin: "10px",
              }}
              onClick={loadProjectAreaHandler}
            >
              Load Project Area
            </button>
          </div>
          {projectArea && (
            <Button
              color="primary"
              icon="plus"
              onClick={() => {
                setIsAddClicked(!isAddClicked);
              }}
            >
              Add new node
            </Button>
          )}{" "}
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
            categories &&
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
            products &&
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
          {projectArea && (
            <Diagram
              style={{
                backgroundImage: `url("${`http://localhost:8000/${projectArea.image}`}")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
              }}
              schema={schema}
              onChange={onChange}
            ></Diagram>
          )}
          {!projectArea && (
            <div
              style={{
                margin: "auto",
                width: "20%",
              }}
            >
              <button
                style={{
                  marginTop: "50%",
                  color: "white",
                  backgroundColor: "green",
                }}
                onClick={loadProjectAreaHandler}
              >
                Load Project Area
              </button>
            </div>
          )}
        </div>

        <Legend nodes={nodes} cleanNodes={onCleanNodes} saveArea={saveArea} />
      </div>
    </>
  );
};

export default UncontrolledDiagram;
