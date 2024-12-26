const { send } = require("../utils/mailer.utils");
const payu = require("../services/payu.service");

module.exports = {
    createOrder: async (req, res) => {
        const productsInCart = {};
        req.body.map(product => {
            const { name, price } = product;
            productsInCart[name] ? productsInCart[name].quantity++ : productsInCart[name] = { quantity: 1, unitPrice: price * 100 };
        })
        const products = Object.entries(productsInCart).map(([name, { quantity, unitPrice }]) => ({ name, quantity, unitPrice }));
        const totalAmount = products.reduce((acc, { quantity, unitPrice }) => acc + quantity * unitPrice, 0);

        const order = {
            "notifyUrl": `${global.config.BASE_URL}/transaction/notify`,
            "continueUrl": `${global.config.BASE_URL}/transaction/status`,
            "customerIp": (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(",")[0],
            "merchantPosId": global.config.PAYU.pos_id,
            "description": "RTV market",
            "currencyCode": "PLN",
            totalAmount,
            "buyer": {
                "email": "john.doe@example.com",
                "phone": "654111654",
                "firstName": "John",
                "lastName": "Doe",
                "language": "pl"
            },
            products
        };

        const response = await payu.createOrder(order);

        res.send(response.url);
    },
    getStatus: (req, res) => {
        if (req.query.error) return res.send(`Payment failed. <a href='${global.config.BASE_URL}'>[Back]</a>`);
        res.send(`Thank you for your payment. <a href='${global.config.BASE_URL}'>[Back]</a>`);
    },
    onNotification: (req, res) => {
        const signature_header = req.get("OpenPayu-Signature");
        const json = JSON.stringify(req.body);
        const second_key = global.config.payu.second_key;

        const { order } = req.body;
        const { orderId, status } = order;

        if (!payu.compareSignatures({ signature_header, json, second_key })) {
            send(`PayU transaction not verified`, `Transaction ${orderId} is NOT VERIFIED<br>${order}`, global.config.CONTACTS.admin.email);
            return res.status(400);
        };

        res.end();

        if (["COMPLETED", "CANCELED"].includes(status)) send(`PayU ${status} transaction`, `Transaction ${orderId} has been ${status}`, global.config.CONTACTS.admin.email);
    },
};
