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
    const { product, configPath } = req.body;
    try {
        if (!product?.length || !configPath?.length) throw new Error("Product was not added to cart.");
        const cart = await service.addUserCartProduct(req.session.user._id, { product, configPath });
        cart.content.at(-1).expanded = true;
        res.render('components/cartContent', { cart });
    } catch (error) {
        if (error.message === "Product was not added to cart.") {
            const cart = await service.getUserCart(req.session.user._id);
            return res.render('components/cartContent', { cart, error: error.message });
        };
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
