// Sidebar.js
import React from 'react';

const Sidebar = ({ cartItems, onClose }) => {
  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200 overflow-y-auto transition-transform transform translate-x-0">
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold p-4 border-b border-gray-200">Cart Items</h2>
      <div className="p-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty</p>
        ) : (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                <span>{item.title}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
