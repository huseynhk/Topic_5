import React, { useState } from "react";
import { emojies } from "../constant/Emoji";
import { Dialog } from "@headlessui/react";

const TableCart = ({ addedProduct, setAddedProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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

  return (
    <>
      <div className="w-full overflow-x-auto bg-violet-200 rounded-md">
        <table className="table-auto w-full text-sm md:text-lg">
          <thead>
            <tr>
              <th className="px-2 py-2 md:px-4">Product</th>
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
                <tr key={item.id} className="text-center">
                  <td className="border px-2 py-2 md:px-4">{item.title}</td>
                  <td className="border px-2 py-2 md:px-4">${item.price}</td>
                  <td className="border px-2 py-2 md:px-4">
                    {item.brand ?? "Unknown"}
                  </td>

                  <td className="border px-2 py-2 md:px-4 flex justify-center items-center">
                    <button
                      className="bg-red-500  px-2 md:px-4 rounded-md text-white flex justify-center items-center"
                      onClick={() => {
                        handleDecrement(item.id);
                      }}
                    >
                      -
                    </button>
                    <span className="bg-indigo-500 mx-2 md:mx-1 rounded-full px-1 md:px-2 text-white flex justify-center items-center">
                      {item.quantity}
                    </span>

                    <button
                      className="bg-green-500 px-2 rounded-md md:px-4 text-white"
                      onClick={() => {
                        handleIncrement(item.id);
                      }}
                    >
                      +
                    </button>
                  </td>

                  <td className="border px-2 py-2 md:px-4">
                    <span className="text-md md:text-xl mr-2 mb-2">
                      {item.rating.toFixed(1)}
                    </span>
                    <span className="text-lg md:text-2xl">
                      {handleEmoji(item.rating)}
                    </span>
                  </td>
                  <td className="border px-2 py-2 md:px-4">
                    ${(item.price * (item.quantity || 0)).toFixed(2)}
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
        className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
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
