import React, { useState } from 'react';

const OrderDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: '6988647684',
      date: '10/8/2024',
      amount: 5504,
      items: [
        { name: 'Idly', plates: 150, pricePerUnit: 5, quantity: 4, amount: 600 },
        { name: 'Biryani', plates: 150, pricePerKg: 3, quantity: 5, amount: 600 },
        { name: 'Biryani', plates: 150, pricePerKg: 5, quantity: 3, amount: 600 },
      ],
      status: 'Processing',
    },
    // Add more orders here if needed
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 bg-green-600 text-white p-2">Your Orders</h1>
      <div className="flex space-x-2 mb-4">
        <button className="bg-orange-100 text-orange-500 border border-orange-500 rounded-full px-4 py-1">CORPORATE</button>
        <button className="bg-blue-100 text-blue-500 border border-blue-500 rounded-full px-4 py-1">EVENT</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 cursor-pointer" onClick={() => handleOrderClick(order)}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p>Order ID: {order.id}</p>
                <p>Date of Order: {order.date}</p>
                <p>Amount: ₹{order.amount}</p>
              </div>
              <button className="bg-red-100 text-red-500 px-2 py-1 rounded">Buy again</button>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <h3 className="text-center font-bold mb-2">Order progress</h3>
              <div className="flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 mb-1"></div>
                  <span className="text-xs">Processing</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-400 mb-1"></div>
                  <span className="text-xs">Shipped</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-green-400 mb-1"></div>
                  <span className="text-xs">Delivery</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Order Details</h2>
          <ul>
            {selectedOrder.items.map((item, index) => (
              <li key={index} className="mb-2">
                <div className="flex items-center">
                  <img src="/api/placeholder/50/50" alt={item.name} className="w-12 h-12 rounded-full mr-2" />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p>No of plates: {item.plates}</p>
                    <p>Price per {item.pricePerUnit ? 'unit' : 'kg'}: ₹{item.pricePerUnit || item.pricePerKg}</p>
                    <p>Quantity: {item.quantity} {item.pricePerUnit ? 'units' : 'kgs'}</p>
                    <p>Amount: ₹{item.amount}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;