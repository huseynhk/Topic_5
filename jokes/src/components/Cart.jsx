import React, { useEffect, useState } from "react";
import { GetProducts } from "../api/getRequest";
import TableCart from "./TableCart";
import { toast } from "react-toastify";

const Cart = () => {
  const [data, setData] = useState([]);
  const [addedProduct, setAddedProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleData = async () => {
    try {
      const response = await GetProducts();
      setData(response.products);
    } catch (error) {
      toast.error("Failed to load products!", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  const addToTable = (id) => {
    const selectedProduct = data.find((product) => product.id === id);
    const existingProduct = addedProduct.find((product) => product.id === id);

    if (!existingProduct) {
      selectedProduct.quantity = 1;
      toast.success("Product added successfully!", {
        autoClose: 1500,
      });
      const updatedAddedProduct = [...addedProduct, selectedProduct];
      updatedAddedProduct.sort((a, b) => b.quantity - a.quantity);
      setAddedProduct(updatedAddedProduct);
      localStorage.setItem("cart", JSON.stringify(updatedAddedProduct));
    } else {
      toast.warning("Product already exists!", {
        autoClose: 1500,
      });
    }
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
      {!loading ? (
        <>
          <div className="my-4 mx-8 rounded-md font-poppins ">
            <h2 className="text-center mb-4 text-3xl text-bold text-blue-200">
              Product Table
            </h2>
            <TableCart
              addedProduct={addedProduct}
              setAddedProduct={setAddedProduct}
            />
          </div>
          <h2 className="text-center mt-2 text-3xl text-bold text-blue-200 font-poppins">
            Product Cards
          </h2>
          <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 font-poppins">
            {data?.map((product) => (
              <li
                key={product.id}
                className="bg-violet-200 rounded-md shadow-md px-2 py-3 m-4"
              >
                <h2 className="text-lg font-semibold text-blue-600 mb-5 truncate">
                  {product.title}
                </h2>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="mb-5 w-full h-56 object-cover rounded-md"
                />
                <p className="text-gray-600 mb-2 font-semibold truncate">
                  {product.description}
                </p>
                <strong className="text-cyan-600">Price: {product.price} $</strong>
                <div className="mt-2">
                  <p className="text-cyan-700 mt-2 font-semibold">
                    Rating: {product.rating}
                  </p>
                  <p className="text-blue-600 my-3 font-semibold">
                    Brand:
                    <span
                      className={`ml-1 ${
                        product.brand ? "" : "text-slate-500"
                      }`}
                    >
                      {product.brand ?? "Unknown"}
                    </span>
                  </p>
                  <button
                    className={`text-white px-4 py-1 rounded-md ${
                      alreadyAdded(product.id)
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`}
                    onClick={() => addToTable(product.id)}
                  >
                    {alreadyAdded(product.id) ? "In Table" : "Add to Table"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center mt-8 font-poppins flex items-center justify-center h-[90vh] ">
          <div>
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full"></div>
            <p className="mt-2 text-2xl text-blue-500">Loading Products...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
