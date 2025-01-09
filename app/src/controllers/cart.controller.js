const service = require('../services/cart.service');

module.exports = {
    getCart,
    getCartLength,
    clearCart,
    addProduct,
    removeProduct,
    updateProduct,
    removeProduct,
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
    if (!(product && path)) res.sendStatus(400);
    try {
        const cart = await service.addUserCartProduct(req.session.user._id, { product, path });
        res.render('components/cartContent', { cart });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function removeProduct(req, res) {
    const productId = req.params.id;
    if (!productId) res.sendStatus(400);
    try {
        const cart = await service.removeUserCartProduct(req.session.user._id, productId);
        res.render('components/cartContent', { cart });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

function updateProduct(req, res) {
    res.send('updateProduct');
};
