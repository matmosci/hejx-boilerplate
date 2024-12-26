const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transaction.controller');

router.post('/notify', transaction.onNotification);
router.get('/status', transaction.getStatus);
router.post('/order', transaction.createOrder);

module.exports = router;