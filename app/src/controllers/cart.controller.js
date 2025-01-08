const service = require('../services/cart.service');

module.exports = {
    getCart,
    getCartLength,
    addProduct,
    removeProduct,
    updateProduct,
};

function getCart(req, res) {
    res.send('getCart');
};

async function getCartLength(req, res) {
    try {
        const length = await service.getUserCartLength(req.session.user._id);
        res.send(length > 0 ? String(length) : '');
    } catch (error) {
        console.log(error);
        res.sendStatus(500);;
    }
};

function addProduct(req, res) {
    res.send('addProduct');
};

function removeProduct(req, res) {
    res.send('removeProduct');
};

function updateProduct(req, res) {
    res.send('updateProduct');
};
