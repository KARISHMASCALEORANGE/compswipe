import React, { useEffect, useState } from 'react';
import { myorders, orderbuyagain } from './action';
import { addtocart } from './action';

const OrderDashboard = () => {
  const [openOrderId, setOpenOrderId] = useState(null);
  const [OrdersData, setOrderData] = useState([]);
  const [cartData, setCartData] = useState(null);  

 


  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const orderData = await myorders();
      setOrderData(orderData);
    };
    fetchOrders();
  }, []);
  const orderedDetails = OrdersData.map((order)=>{
      // console.log("order",order);
      return {
        total_amount: order.total_amount,
        event_order_details: order.event_order_details,
        customer_address: order.customer_address,
      };
      
      
  })


  const formattedOrders = OrdersData.map((order) => {
    const formattedItems = order.event_order_details.map((item) => ({
      name: item.productname,
      plates: item.minunitsperplate,
      pricePerUnit: item.priceperunit,
      pricePerKg: item.isdual ? item.priceperunit : undefined,
      quantity: item.quantity,
      amount: item.quantity * item.priceperunit,
    }));
    return {
      id: order.eventorder_generated_id,
      date: formatOrderDate(order.ordered_at),
      amount: order.total_amount,
      items: formattedItems,
      status: order.event_order_status,
    };
  });

  const handleOrderClick = (order) => {
    if (openOrderId === order.id) {
      setOpenOrderId(null);
    } else {
      setOpenOrderId(order.id);
    }
  };


  const handleBuyAgain = async (orderedId) => {
    const orderedDetails = OrdersData.find((order) => order.eventorder_generated_id === orderedId);
  
    if (orderedDetails) {
      // Set the cart data as an object containing event_order_details, customer_address, and total_amount
      setCartData({
        event_order_details: orderedDetails.event_order_details,
        customer_address: orderedDetails.customer_address,
        total_amount: orderedDetails.total_amount,
      });

      // Call buyagainfun after setting cartData
      buyagainfun({
        event_order_details: orderedDetails.event_order_details,
        customer_address: orderedDetails.customer_address,
        total_amount: orderedDetails.total_amount,
      });

      console.log('Ordered Details:', orderedDetails);
    } else {
      console.log('Order not found for this ID:', orderedId);
    }
  };

 
  const buyagainfun = async (updatedCartData) => {
    if (updatedCartData) {
      await orderbuyagain(updatedCartData); // Assuming orderbuyagain is your API call function
    }
  };

  // useEffect to log cartData whenever it changes
  useEffect(() => {
    if (cartData) {
      console.log('Updated Cart Data:', cartData);
    }
  }, [cartData]);
  
  
 
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 bg-green-600 text-white p-2">Your Orders</h1>
      <div className="flex space-x-2 mb-4">
        <button className="bg-orange-100 text-orange-500 border border-orange-500 rounded-full px-4 py-1">CORPORATE</button>
        <button className="bg-blue-100 text-blue-500 border border-blue-500 rounded-full px-4 py-1">EVENT</button>
      </div>
      <div className=" gap-4">
        {formattedOrders.length > 0 && formattedOrders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 cursor-pointer" onClick={() => handleOrderClick(order)}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p>Order ID: {order.id}</p>
                <p>Date of Order: {order.date}</p>
                <p>Amount: ₹{order.amount}</p>
              </div>
              <button className="bg-red-100 text-red-500 px-2 py-1 rounded" onClick={() => handleBuyAgain(order.id)}>Buy again</button>
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
            {openOrderId === order.id && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow">
                <button onClick={() => handleOrderClick(order)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full text-left flex justify-between items-center">
                  {openOrderId === order.id ? 'Hide Details' : 'Show Details'}
                  <span className="text-xs">{openOrderId === order.id ? '▲' : '▼'}</span>
                </button>
                <div>
                  <h2 className="text-xl font-bold mb-2">Order Details</h2>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index} className="mb-2">
                        <div className="flex items-center">
                          <img src="/api/placeholder/50/50" alt={item.name} className="w-12 h-12 rounded-full mr-2" />
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p>No of plates: {item.plates}</p>
                            <p>Price per {item.pricePerUnit ? 'units' : 'kgs'}: ₹{item.pricePerUnit || item.pricePerKg}</p>
                            <p>Quantity: {item.quantity} {item.pricePerUnit ? 'units' : 'kgs'}</p>
                            <p>Amount: ₹{item.amount}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDashboard;





