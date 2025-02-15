const service = require('../services/cart.service');
const render = require("../utils/render.utils");

module.exports = {
    getCart,
    getCartJSON,
    clearCart,
    addProduct,
    removeProduct,
    updateProduct,
    removeProduct,
    checkout,
    getShipment,
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

async function getCartJSON(req, res) {
    try {
        const cart = await service.getUserCart(req.session.user._id);
        res.json(cart);
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

async function checkout(req, res) {
    try {
        const cart = await service.getUserCart(req.session.user._id);
        render(req, res, "checkout", { cart });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function getShipment(req, res) {
    const selectedShipmentMethod = req.query['selected-shipment-method'];
    if (!selectedShipmentMethod) return res.end();
    res.send(`[${selectedShipmentMethod} details]`);
};

function updateProduct(req, res) {
    res.send('updateProduct');
};
