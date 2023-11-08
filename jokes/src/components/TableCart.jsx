import React from "react";
import { emojies } from "../constant/Emoji";

const TableCart = ({ addedProduct, setAddedProduct }) => {
  
  const deleteFromTable = (id) => {
    const updatedAddedProduct = addedProduct.filter(
      (product) => product.id !== id
    );
    setAddedProduct(updatedAddedProduct);
    localStorage.setItem("cart", JSON.stringify(updatedAddedProduct));
  };

  const handleIncrement = (id) => {
    const updatedAddedProduct = addedProduct.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: (product.quantity || 0) + 1 };
      }
      return product;
    });
    updatedAddedProduct.sort((a, b) => b.quantity - a.quantity);
    setAddedProduct(updatedAddedProduct);
    localStorage.setItem("cart", JSON.stringify(updatedAddedProduct));
  };

  const handleDecrement = (id) => {
    const updatedAddedProduct = addedProduct.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: (product.quantity || 0) - 1 };
      } else {
        return product;
      }
    });
    updatedAddedProduct.sort((a, b) => b.quantity > a.quantity ? 1 : -1);
    setAddedProduct(updatedAddedProduct);
    localStorage.setItem("cart", JSON.stringify(updatedAddedProduct));
  };

  const handleEmoji = (item) => {
    let emoji;
    if (item < 2) {
      emoji = emojies.emoji_1;
    } else if (item < 5 && item >= 2) {
      emoji = emojies.emoji_2;
    } else if (item < 8 && item >= 5) {
      emoji = emojies.emoji_3;
    } else if (item < 11 && item >= 8) {
      emoji = emojies.emoji_4;
    } else {
      emoji = emojies.emoji_5;
    }
    return emoji;
  };

  return (
    <>
      <div className="w-full overflow-x-auto bg-violet-100">
        <table className="table-auto w-full text-sm md:text-lg">
          <thead>
            <tr>
              <th className="px-2 py-2 md:px-4">Product</th>
              <th className="px-2 py-2 md:px-4">Price</th>
              <th className="px-2 py-2 md:px-4">Brand</th>
              <th className="px-2 py-2 md:px-4">Delete</th>
              <th className="px-2 py-2 md:px-4">Quantity</th>
              <th className="px-2 py-2 md:px-4">Rating</th>
            </tr>
          </thead>
          <tbody>
            {addedProduct.map((item, index) => (
              <tr key={item.id} className="text-center">
                <td className="border px-2 py-2 md:px-4">{item.title}</td>
                <td className="border px-2 py-2 md:px-4">${item.price}</td>
                <td className="border px-2 py-2 md:px-4">{item.brand}</td>
                <td className="border px-2 py-2 md:px-4">
                  <button
                    className="bg-red-500 px-3 py-1 rounded-md text-white"
                    onClick={() => {
                      deleteFromTable(item.id);
                    }}
                  >
                    Delete
                  </button>
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

                <td className="border px-2 py-2 md:px-4 text-lg md:text-2xl ">{handleEmoji(index)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableCart;
