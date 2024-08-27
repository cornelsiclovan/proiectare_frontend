import CustomRender from "./CustomRender";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";

import Background from "./casa.png";
import Legend from "../legend/Legend";
import { getAuthToken } from "../../util/auth";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const categories = ["sensors", "motors", "microcontroller"];
const colors = ["red", "green", "yellow"];

let i = 0;
let x = 0;
let y = 0;

const BASE_URL = process.env.REACT_APP_BASE_URL;

const UncontrolledDiagram = ({ types }) => {
  const navigate = useNavigate();

  const [showOffer, setShowOffer] = useState(false);
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [nodesForCleanup, setNodesForCleanup] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [projectArea, setProjectArea] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(
    localStorage.getItem("selectedProject")
      ? localStorage.getItem("selectedProject")
      : null
  );
  const [projectAreas, setProjectAreas] = useState([]);
  const [workingAreaId, setWorkingAreaId] = useState(
    localStorage.getItem("workingAreaId")
      ? localStorage.getItem("workingAreaId")
      : null
  );

  const [zoom, setZoom] = useState(100)

  const initalSchema = createSchema({
    nodes: [],
  });

  let intermediaryNodeArray = [];

  const [schema, { onChange, addNode, removeNode }] = useSchema(initalSchema);

  const [nodesCount, setNodesCount] = useState(schema.nodes.length);

  const myProducts = [];

  useEffect(() => {
    const fetchCurrentWorkingArea = async () => {
      schema.nodes.map((node) => {
        deleteNodeFromSchema(node.id);
        //removeNode(node);
      });

      const token = getAuthToken();

      const response = await fetch(
        `${BASE_URL}/prodsToAreas/` + workingAreaId,
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
        prod.list_price = p.list_price;
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
          `${BASE_URL}/areas/` + workingAreaId,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.json();

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
        const response = await fetch(`${BASE_URL}/projects`, {
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
          `${BASE_URL}/projects/` + selectedProject + "/areas",
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
    }
  }, [modalOpen, selectedProject]);

  const closeModal = () => {
    setModalOpen(false);
    navigate("/");
  };

  const deleteNodeFromSchema = async (id, fromOffer = false) => {
    const token = getAuthToken();
    const nodeToRemove = schema.nodes.find((node) => node.id === id);

    if (myProducts.length > 0) {
      const prodToRemove = myProducts.filter((prod) => prod.node_id === id);


      const response = await fetch(
        `${BASE_URL}/prodsToAreas/` + prodToRemove[0].id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();
    }

    if (nodeToRemove) {
      removeNode(nodeToRemove);
    }

    if (!fromOffer) {
      let nodesToRemove = [...nodes];

      let result = nodesToRemove.find(
        ({ content }) => content === nodeToRemove.content
      );

      if (result.count > 0) {
        result.list_price =
          result.list_price - result.list_price / result.count;
        result.count--;
        if (result.count == 0) {
          nodesToRemove = nodesToRemove.filter(
            ({ content }) => content !== nodeToRemove.content
          );
        }
      } else {
        nodesToRemove = nodesToRemove.filter(
          ({ content }) => content !== nodeToRemove.content
        );
      }

      setNodesCount(schema.nodes.length);
    } else {
      setNodes([]);
    }
  };

  const getCategoriesByType = async (type) => {
    const token = getAuthToken();
    const response = await fetch(
      `${BASE_URL}/categories/` + type.id,
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
        `${BASE_URL}/products?type=` + type.name,
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
      `${BASE_URL}/products?category=` + category.name,
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

    intermediaryNodeArray.push(nextNode);

    addNode(nextNode);

    let nodesToAdd = nodes;
    let nodesToRemove = nodesForCleanup;

    const result = nodesToAdd.find(
      ({ content }) => content === nextNode.content
    );
    if (result) {
      result.count++;
      result.list_price = result.count * +type.list_price;
    } else {
      nodesToAdd.push({
        content: nextNode.content,
        count: 1,
        id: nextNode.id,
        productId: type.id,
        list_price: +type.list_price,
      });
    }

    nodesToRemove.push({
      content: nextNode.content,
      count: 1,
      id: nextNode.id,
      productId: type.id,
      list_price: +type.list_price,
    });

    setNodes([...nodesToAdd]);
    setNodesForCleanup([...nodesToRemove]);

 
    if (!oldNode) {
      saveArea(true);
    }

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

  const saveArea = async (notOldNode) => {
    const token = getAuthToken();
    let sendBody = { products: schema.nodes };
    let sendAddress = `${BASE_URL}/prodsToAreas/` + projectArea.id;
    if (notOldNode) {
     
      sendAddress = `${BASE_URL}/prodsToAreas/one/` + projectArea.id;
      sendBody = { products: intermediaryNodeArray };
    } else {
      
    }

    const response = await fetch(sendAddress, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendBody),
    });

    let data = await response.json();
    if (notOldNode) {
      let j = myProducts.length;
      let prod = {};
      prod.id = data.product.id;
      prod.color = data.product.node_id.split("-")[1];
      prod.name = data.product.content.split("-")[1];
      prod.x = data.product.orizontal;
      prod.y = data.product.vertical;
      prod.node_id = data.product.node_id;
      prod.list_price = data.product.list_price;

      j = +prod.node_id.split("-")[2] + 1;
      myProducts.push(prod);
    }
    console.log(data);
  };

  const triggerChange = () => {
    onChange(onChange);
    saveArea();
  };

  const isIpad = useMediaQuery("(max-width: 1300px)");

  const addZoom = () => {
    let myZoom = zoom + zoom/10;
    setZoom(myZoom);
  }

  const substractZoom = () => {

    let myZoom = zoom - zoom/10;
    setZoom(myZoom);
    console.log(myZoom);
  }

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
                      localStorage.setItem("selectedProject", project.id);
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
            <img src={`${BASE_URL}/${projectArea.image}`}></img>
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
            <button onClick={addZoom}>+</button>
            <button onClick={substractZoom}>-</button>
          </div>
          {projectArea && (
            <button
              color="primary"
              icon="plus"
              onClick={() => {
                setIsAddClicked(!isAddClicked);
              }}
            >
              Add new node
            </button>
          )}{" "}
          <br />
          {isAddClicked &&
            types &&
            types.types.map((type) => (
              <>
                <button
                  color="primary"
                  icon="plus"
                  onClick={() => {
                    //addNewNode(type.name);
                    getCategoriesByType(type);
                  }}
                >
                  {type.name}
                </button>
                <br />
              </>
            ))}
          {isAddClicked &&
            categories &&
            categories.length != 0 &&
            categories.map((category) => (
              <>
                <button
                  color="primary"
                  icon="minus"
                  onClick={() => {
                    getProductsByCategory(category);
                  }}
                >
                  {category.name}
                </button>
                <br />
              </>
            ))}
          {isAddClicked &&
            products &&
            products.length != 0 &&
            products.map((product) => (
              <>
                <button
                  color="primary"
                  icon="minus"
                  onClick={() => {
                    addNewNode(product);
                  }}
                >
                  {product.name}
                </button>
                <br />
              </>
            ))}
        </div>
        <div
          style={{
            height: isIpad ? "40rem" : "70rem",
            width: isIpad ? "100rem": "200rem",
            //height: "1000px",
           
            overflow: "auto"
          }}
        >
          {projectArea && (
              <Diagram
                style={{
                  backgroundImage: `url("${`${BASE_URL}/${projectArea.image}`}")`,
                  backgroundRepeat: "no-repeat",
                  //backgroundSize: "100% 100%",
                  minWidth: "100%",
                  minHeight: "100%",
                  width: 2 * zoom + "%",
                  height: 1.5* zoom + "%",
                  //width: "1500px",
                  zoom: zoom +"%",
           
                  //height: "500px"
                }}
                schema={schema}
                onChange={triggerChange}
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

        <Legend
          nodes={nodes}
          cleanNodes={onCleanNodes}
          saveArea={saveArea}
          nodesCount={nodesCount}
          selectedProject={selectedProject}
          setShowOffer={setShowOffer}
          showOffer={showOffer}
        />
      </div>
    </>
  );
};

export default UncontrolledDiagram;
