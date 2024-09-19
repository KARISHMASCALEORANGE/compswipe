const logger = require('../config/logger');
// const customerController = require('../controller/customerController.js');
const cartModel = require('../models/eventorderModels.js')

const fetchProducts = async (req, res) => {
  try {
    const categories = await cartModel.getAllProductCategories();
    //console.log("in controller",categories.rows)
    res.send(categories);
  

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}



const addToCart = async (req, res) => {
  // console.log("above cart")
  const customer_id = 1;
  const { totalAmount,cartData,address} = req.body;
  // console.log("in cart");
  try {
    // console.log("cart items",totalAmount,cartData,address)
    // // Validate required fields
    // const token = req.headers["access_token"]
    //  const response = await customerController.getuserbytoken({ body: { access_token: token } })
    const result = await cartModel.addCart( customer_id,totalAmount,cartData,address);
    // console.log("result",result);
    res.status(200).json(result);
     
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



const getOrderDetails = async (req, res) => {
  // Extract order ID from request params
//  console.log("helloooo");
  try {
    // Fetch order details using the model function

    // const token = req.headers["access_token"]
    // const response = await customerController.getuserbytoken({ body: { access_token: token } })
    const customer_id = 1
    // console.log(customer_id)
    const order = await cartModel.getOrderDetailsById(customer_id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log("order",order);
    res.status(200).json(order);

  } catch (error) {
    console.error('Error retrieving order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


const transferCartToOrder = async (req, res) => {
  console.log("in add to order controller",req.body)
  const { eventcart_id } = req.body;
  const customer_id = 1;
  
  try {
    // Get the cart data
    const cart = await cartModel.getCartById(eventcart_id);
    console.log("cart data",cart);

    if (!cart) {
        return res.status(400).json({ error: 'Cart is empty or not found' });
      }
    
      const cartData = cart[0];

      // Prepare order data
      const orderData = {
        customer_id: customer_id,
        // ordered_at: cartData.order_date, 
        delivery_status: 'Pending', 
        total_amount: cartData.total_amount,
        delivery_details: cartData.delivery_details,
        cart_order_details: cartData.cart_order_details,
        event_media: null, 
        customer_address: cartData.address,
        payment_status: 'Unpaid', 
        event_order_status: 'New' 
      };
    console.log("ordered data",orderData);

    // Insert the cart data into event_orders
    const order = await cartModel.insertEventOrder(orderData);
    console.log("order",order);


    // Optionally, delete the cart after transfer
    await cartModel.deleteCart(eventcart_id);

    res.status(201).json(order);
  } catch (error) {
    logger.error('Error transferring cart to order: ', error);
    res.status(500).json({ error: 'Error transferring cart to order', details: error.message });
  }
};

//controller

module.exports = {
  fetchProducts,
  addToCart,
  getOrderDetails,
  transferCartToOrder
};
