const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');

router.get('/', controller.getCart);
router.post('/', controller.createCart);
router.delete('/', controller.deleteCart)
router.delete('/content', controller.clearCart);
router.get('/select', controller.activeCartSelect);
router.post('/products', controller.addProduct);
router.delete('/products/:id', controller.removeProduct);
router.put('/products/:id', controller.updateProduct);
router.get('/checkout', controller.checkout);
router.get('/manage', controller.manager);
router.get('/shipping', controller.getShipping);
router.put('/shipping', controller.updateShipping);
router.post('/order', controller.postOrder);

module.exports = router;
