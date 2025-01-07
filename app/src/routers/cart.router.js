const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');

router.get('/', controller.getCart);
router.post('/add', controller.addProduct);
router.post('/remove', controller.removeProduct);
router.post('/update', controller.updateProduct);

module.exports = router;
