const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');

router.get('/', controller.getCart);
router.delete('/', controller.clearCart);
router.get('/length', controller.getCartLength);
router.post('/product', controller.addProduct);
router.delete('/product/:id', controller.removeProduct);
router.put('/product/:id', controller.updateProduct);

module.exports = router;
