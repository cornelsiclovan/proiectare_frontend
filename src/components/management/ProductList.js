const ProductList = ({ products }) => {
 
  return (
    <>
      <ul style={{listStyleType: "none"}}>
        <b>Products  <button>Add new</button></b>
        {products &&
          products.map((product) => (
            <li >
              <button>
                {product.name}
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default ProductList;
