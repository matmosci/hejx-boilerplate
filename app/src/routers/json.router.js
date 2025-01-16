const express = require('express');
const router = express.Router();
const json = {
    cart: require('../controllers/cart.controller').getCartJSON
}

router.get('/cart.json', json.cart);

module.exports = router;
