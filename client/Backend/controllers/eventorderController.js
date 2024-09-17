const logger = require('../config/logger');
// const customerController = require('../controller/customerController.js');
const cartModel = require('../models/eventorderModels.js')

const fetchProducts = async (req, res) => {
  try {
    console.log('hello');
    const categories = await cartModel.getAllProductCategories();
    console.log("hi",categories);
    //console.log("in controller",categories.rows)
    res.send(categories);
  

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}



const addToCart = async (req, res) => {
  const { total_amount, cart_order_details, address } = req.body;
  try {
    // // Validate required fields
    // const token = req.headers["access_token"]
    // const response = await customerController.getuserbytoken({ body: { access_token: token } })
    // const customer_id = response.customer_id
    const customer_id = 1;
    if ( !customer_id || !total_amount || !cart_order_details || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Insert into database
    const cartItem = await cartModel.addToCart( customer_id, total_amount, cart_order_details, address);
    res.status(201).json({ message: 'Product added to cart', data: cartItem });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = {
  fetchProducts,
  addToCart
};
