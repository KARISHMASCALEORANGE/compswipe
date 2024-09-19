const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventorderController');
// const { menuPage } = require('../controllers/eventorderController');

//Route to get the categories
// router.get('/categories', eventController.fetchEventCategories);
router.get('/products', eventController.fetchProducts);
router.post('/cart/add', eventController.addToCart);

router.get('/myorders',eventController.getOrderDetails);
router.post('/transfer-cart-to-order', eventController.transferCartToOrder);
router.post('/orderbuyagain',eventController.orderbuyagain);



// router.get('/menuPage',eventController.menuPage);   

module.exports = router;



