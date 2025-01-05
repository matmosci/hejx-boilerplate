const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');

router.get('/', controller.getContainerMain);
router.get('/category/:category', controller.getContainer);
router.get('/:product', controller.getProductDefault);
router.get('/:product/*', controller.getProductWithConfig);

module.exports = router;