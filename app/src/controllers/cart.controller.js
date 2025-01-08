const service = require('../services/cart.service');

module.exports = {
    getCart,
    getCartLength,
    clearCart,
    addProduct,
    removeProduct,
    updateProduct,
};

async function getCart(req, res) {
    try {
        const cart = await service.getUserCart(req.session.user._id);
        res.render('components/cartContent', { cart });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function clearCart(req, res) {
    try {
        const cart = await service.clearUserCart(req.session.user._id);
        res.render('components/cartContent', { cart });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
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

async function addProduct(req, res) {
    const { product, path } = req.body;
    try {
        if (!(product && path)) res.sendStatus(400);
        const cart = await service.addUserCartProduct(req.session.user._id, { product, path });
        res.render('components/cartContent', { cart });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

function removeProduct(req, res) {
    res.send('removeProduct');
};

function updateProduct(req, res) {
    res.send('updateProduct');
};
