import React, { useEffect, useState } from "react";
import { GetProducts } from "../api/getRequest";
import TableCart from "./TableCart";

const Cart = () => {
  const [data, setData] = useState([]);
  const [addedProduct, setAddedProduct] = useState([]);

  const handleData = async () => {
    const response = await GetProducts();
    setData(response.products);
  };

  const addToTable = (id) => {
    const selectedProduct = data.find((product) => product.id === id);
    const existingProduct = addedProduct.find((product) => product.id === id);

    if (!existingProduct) {
      selectedProduct.quantity = 1;
    } // add etdiyim mehsul tablede yoxdursa sayin 1 olaraq add elesin

    let updatedAddedProduct = existingProduct
      ? [...addedProduct]
      : [...addedProduct, selectedProduct];
      
    updatedAddedProduct.sort((a, b) => b.quantity - a.quantity);
    setAddedProduct(updatedAddedProduct);
    localStorage.setItem("cart", JSON.stringify(updatedAddedProduct));
  };

  const alreadyAdded = (id) => {
    const existingProduct = addedProduct.find((product) => product.id === id);
    return existingProduct;
  };

  useEffect(() => {
    handleData();
    const storedProduct = localStorage.getItem("cart");
    if (storedProduct) {
      setAddedProduct(JSON.parse(storedProduct));
    }
  }, []);

  return (
    <>
      <div className="m-8 rounded-md">
        <h2 className="text-center mb-4 text-4xl text-bold text-indigo-200">
          Product Table
        </h2>
        {addedProduct.length > 0 && (
          <TableCart
            addedProduct={addedProduct}
            setAddedProduct={setAddedProduct}
          />
        )}
      </div>

      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 ">
        {data.map((product) => (
          <li
            key={product.id}
            className="bg-violet-100 rounded-md shadow-md p-2 m-4"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-3">
              {product.title}
            </h2>
            <img
              src={product.images[0]}
              alt={product.title}
              className="mb-5 w-full h-60 object-cover rounded-md"
            />
            <p className="text-gray-600 mb-2 font-semibold">
              {product.description.slice(0, 30)}
            </p>
            <strong className="text-green-600">${product.price}</strong>
            <div className="mt-2">
              <p className="text-green-600 my-3 font-semibold">
                Brand: {product.brand}
              </p>
              <button
                className="bg-green-500 text-white px-4 py-1 rounded-md"
                onClick={() => addToTable(product.id)}
              >
                {alreadyAdded(product.id) ? "In Table" : "Add to Table"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Cart;
