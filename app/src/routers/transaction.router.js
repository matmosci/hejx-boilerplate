const express = require('express');
const router = express.Router();
const { send } = require('../utils/mailer.utils');
const { compare } = require('../utils/payu.utils');

router.post('/notify', (req, res) => {
    const signature_header = req.get("OpenPayu-Signature");
    const json = JSON.stringify(req.body);
    const second_key = global.config.payu.second_key;

    const { order } = req.body;
    const { orderId, status } = order;

    if (!compare({ signature_header, json, second_key })) {
        send(`PayU transaction not verified`, `Transaction ${orderId} is NOT VERIFIED<br>${order}`, global.config.CONTACTS.admin.email);
        return res.status(400);
    }

    res.end();
    if (!["COMPLETED", "CANCELED"].includes(status)) return;
    send(`PayU ${status} transaction`, `Transaction ${orderId} has been ${status}`, global.config.CONTACTS.admin.email);
});
router.get('/status', (req, res) => {
    if (req.query.error) return res.send(`Payment failed. <a href='${global.config.BASE_URL}'>[Back]</a>`);
    res.send(`Thank you for your payment. <a href='${global.config.BASE_URL}'>[Back]</a>`);
});

module.exports = router;