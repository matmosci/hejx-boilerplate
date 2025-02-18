const service = require('../services/cart.service');
const render = require("../utils/render.utils");
const shippingMethods = require("../../data/shippingMethods"); // TODO to service

module.exports = {
    getCart,
    getCartJSON,
    clearCart,
    addProduct,
    removeProduct,
    updateProduct,
    removeProduct,
    checkout,
    getShipping,
    updateShipping,
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

function updateProduct(req, res) {
    res.send('updateProduct');
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
        render(req, res, "checkout", { cart, shippingMethods });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function getShipping(req, res) {
    const cart = await service.getUserCart(req.session.user._id);
    const selectedShippingMethod = req.query['selected-shipping-method'];
    if (!selectedShippingMethod) return res.end();
    const method = shippingMethods.find(method => method.name === selectedShippingMethod);
    res.render('components/cartCheckoutShippingMethod', { cart, method, user: req.session.user });
};

async function updateShipping(req, res) {
    const cart = await service.getUserCart(req.session.user._id);
    cart.shipping.selectedMethod = req.body['selected-shipping-method'];
    const details = { ...req.body };
    delete details['selected-shipping-method'];
    cart.shipping.details.set(req.body['selected-shipping-method'], details);
    await cart.save();
    res.render('components/cartCheckoutShippingSelected', { cart, shippingMethods });
};

(async () => {
    const Cart = require("../models/Cart.model");
    // const cart = await Cart.findOne({userId:"6784ec390dc80aa431160cf9"});
    // const cart = await Cart.create({userId:"6784ec390dc80aa431160cf9"});
    // console.log(cart);
    // await Cart.findByIdAndDelete(cart._id);
    // await Cart.findOneAndDelete({ userId: "6784ec390dc80aa431160cf9" });

    // cart.shipping.selectedMethod = "curier";
    // cart.shipping.details.set('curier', {town: "asd", street: "asd", number: "asd", postalCode: "asd"});
    // await cart.save();
    // console.log(cart.shipping);

    // console.log(await Cart.find({ userId: "6784ec390dc80aa431160cf9" }));
    // console.log((await Cart.findOne({userId:"6784ec390dc80aa431160cf9"})).shipping);

})();