
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth-check');
const ordersController = require('../controllers/orderController');


router.get('/', checkAuth, ordersController.orders_get_all);

router.post('/', checkAuth, ordersController.orders_create_order);

router.get('/:orderId', checkAuth, ordersController.orders_get_order);

router.delete('/:orderId', checkAuth, ordersController.orders_delete);


module.exports = router;