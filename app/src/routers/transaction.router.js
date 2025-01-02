const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transaction.controller');

router.post('/notify', transaction.onNotification);
router.get('/status', (req, res) => {
    if (req.query.error) return res.send(`Payment failed. <a href='${global.config.BASE_URL}'>[Back]</a>`);
    res.send(`Thank you for your payment. <a href='${global.config.BASE_URL}'>[Back]</a>`);
});

module.exports = router;