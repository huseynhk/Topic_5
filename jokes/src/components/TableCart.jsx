import React, { useState } from "react";
import { emojies } from "../constant/Emoji";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";

const TableCart = ({ addedProduct, setAddedProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [sortOption, setSortOption] = useState("");

  const openModal = (id) => {
    setIsModalOpen(true);
    setProductToDelete(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const deleteFromTable = (id) => {
    const updatedAddedProduct = addedProduct.filter(
      (product) => product.id !== id
    );
    setAddedProduct(updatedAddedProduct);
    localStorage.setItem("cart", JSON.stringify(updatedAddedProduct));
    setIsModalOpen(false);
    toast.success("Product deleted successfully!", {
      autoClose: 1500,
    });
  };

  const handleIncrement = (id) => {
    const updatedAddedProduct = addedProduct.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: (product.quantity || 0) + 1 };
      }
      return product;
    });
    // updatedAddedProduct.sort((a, b) => b.quantity - a.quantity);
    setAddedProduct(updatedAddedProduct);
    localStorage.setItem("cart", JSON.stringify(updatedAddedProduct));
  };

  const handleDecrement = (id) => {
    const updatedAddedProduct = addedProduct.map((product) => {
      if (product.id === id) {
        if (product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
      }
      return product;
    });

    setAddedProduct(updatedAddedProduct);
    localStorage.setItem("cart", JSON.stringify(updatedAddedProduct));
  };

  const handleEmoji = (rating) => {
    if (rating >= 4) {
      return emojies.emoji_1;
    } else if (rating >= 3 && rating < 4) {
      return emojies.emoji_3;
    } else {
      return emojies.emoji_5;
    }
  };

  const totalSum = addedProduct.reduce(
    (sum, product) => sum + product.price * (product.quantity || 0),
    0
  );

  const handleSort = (option) => {
    setSortOption(option);
    if (option === "ratingHighToLow") {
      const sortedProducts = [...addedProduct].sort(
        (a, b) => b.rating - a.rating
      );
      setAddedProduct(sortedProducts);
    } else if (option === "ratingLowToHigh") {
      const sortedProducts = [...addedProduct].sort(
        (a, b) => a.rating - b.rating
      );
      setAddedProduct(sortedProducts);
    } else if (option === "reset") {
      const initialData = JSON.parse(localStorage.getItem("cart")) || [];
      setAddedProduct(initialData);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto bg-violet-200 rounded-md font-poppins">
        <div className="flex justify-end mb-4">
          <select
            className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2 mt-2"
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Sort by...</option>
            <option value="ratingHighToLow">Rating: High to Low</option>
            <option value="ratingLowToHigh">Rating: Low to High</option>
            <option value="reset">Reset</option>
          </select>
        </div>
        <table className="table-auto w-full text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-2 py-2 md:px-4">Image</th>
              <th className="px-2 py-2 md:px-4">Product Name</th>
              <th className="px-2 py-2 md:px-4">Price</th>
              <th className="px-2 py-2 md:px-4">Brand</th>
              <th className="px-2 py-2 md:px-4">Quantity</th>
              <th className="px-2 py-2 md:px-4">Rating</th>
              <th className="px-2 py-2 md:px-4">Sum</th>
              <th className="px-2 py-2 md:px-4">Delete</th>
            </tr>
          </thead>
          {addedProduct.length > 0 && (
            <tbody>
              {addedProduct?.map((item) => (
                <tr
                  key={item.id}
                  className={`text-center ${
                    item.rating > 4
                      ? "bg-green-200"
                      : item.rating >= 3 && item.rating <= 4
                      ? "bg-blue-200"
                      : "bg-red-200"
                  }`}
                >
                  <td className="border px-2 py-2 md:px-4">
                    <img className="w-14 h-10 object-fill mx-auto" src={item.images[0]} alt={item.title} />
                  </td>

                  <td className="border px-2 py-2 md:px-4 font-medium">{item.title}</td>
                  <td className="border px-2 py-2 md:px-4">${item.price}</td>
                  <td className="border px-2 py-2 md:px-4">
                    {item.brand ?? "Unknown"}
                  </td>

                  <td className="border border-b-0 px-2 py-2 md:px-4  flex justify-center items-center">
                    <button
                      className="bg-red-500  mt-2 px-2 md:px-4 rounded-md text-white flex justify-center items-center"
                      onClick={() => {
                        handleDecrement(item.id);
                      }}
                    >
                      -
                    </button>
                    <span className="bg-indigo-500 mt-2 mx-2  rounded-full px-1 md:px-2 min-w-[36px] text-white flex justify-center items-center">
                      {item.quantity}
                    </span>

                    <button
                      className="bg-green-500 mt-2 px-2 rounded-md md:px-4 text-white"
                      onClick={() => {
                        handleIncrement(item.id);
                      }}
                    >
                      +
                    </button>
                  </td>

                  <td className="border px-2 py-2 md:px-4">
                    <span className="md:text-xl mr-2 mb-2">
                      {item.rating.toFixed(1)}
                    </span>
                    <span className="md:text-xl">
                      {handleEmoji(item.rating)}
                    </span>
                  </td>
                  <td className="border px-2 py-2 md:px-4 ">
                    <p className="min-w-[90px]">${(item.price * (item.quantity || 0)).toFixed(2)}</p>
                  </td>

                  <td className="border px-2 py-2 md:px-4">
                    <button
                      className="bg-red-500 px-3 py-1 rounded-md text-white"
                      onClick={() => {
                        openModal(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        <div className="p-4 text-right">
          <span className="text-lg md:text-xl font-bold">
            Total Sum: ${totalSum.toFixed(2)}
          </span>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 font-poppins"
      >
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
          <Dialog.Title className="text-lg font-bold text-gray-800">
            Confirm Deletion
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Dialog.Description>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => deleteFromTable(productToDelete)}
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TableCart;
