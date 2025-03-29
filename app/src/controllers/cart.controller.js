const service = require('../services/cart.service');
const render = require("../utils/render.utils");
const shippingMethods = require("../../data/shippingMethods"); // TODO create shipping service
// TODO create order service
const OrderNumber = require('../models/OrderNumber.model');
const Order = require('../models/Order.model');
const payu = require('../services/payu.service');

module.exports = {
    getCart,
    createCart,
    activeCartSelect,
    getCartJSON,
    clearCart,
    addProduct,
    updateProduct,
    removeProduct,
    checkout,
    getShipping,
    updateShipping,
    postOrder,
};

async function activeCartSelect(req, res) {
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.query["active-cart-select"])
            ?? userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString())
            ?? userCarts.at(-1)
            ?? await service.createUserCart(req.session.user._id);

        req.session.active_cart = cart._id;

        res.render('components/CartResponse', { cart, userCarts });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function getCart(req, res) {
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString())
            ?? userCarts.at(-1)
            ?? await service.createUserCart(req.session.user._id);

        req.session.active_cart = cart._id;

        res.render('components/CartResponse', { cart, userCarts });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function createCart(req, res) {
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = await service.createUserCart(req.session.user._id);
        userCarts.push(cart);

        req.session.active_cart = cart._id;

        res.render('components/CartResponse', { cart, userCarts });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function getCartJSON(req, res) {
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
        res.json(cart);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function clearCart(req, res) {
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
        const cartUpdated = await service.clearCart(cart._id);
        res.render('components/CartResponse', { cart: cartUpdated, userCarts });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function addProduct(req, res) {
    const { product, configPath } = req.body;
    try {
        if (!product?.length || !configPath?.length) throw new Error("Product was not added to cart.");
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
        const cartUpdated = await service.addCartProduct(cart._id, { product, configPath });
        cartUpdated.content.at(-1).expanded = true;
        res.render('components/CartResponse', { cart: cartUpdated, userCarts });
    } catch (error) {
        if (error.message === "Product was not added to cart.") {
            const cart = await service.getUserCart(req.session.user._id);
            return res.render('components/CartResponse', { cart, userCarts, error: error.message });
        };
        console.log(error);
        res.sendStatus(500);
    }
};

async function updateProduct(req, res) {
    const productId = req.params.id;
    if (!productId) return res.sendStatus(400);
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
        const cartUpdated = await service.updateCartProduct(cart._id, productId, req.body);
        res.render('components/CartResponse', { cart: cartUpdated, userCarts });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function removeProduct(req, res) {
    const productId = req.params.id;
    if (!productId) res.sendStatus(400);
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
        const cartUpdated = await service.removeCartProduct(cart._id, productId);
        res.render('components/CartResponse', { cart: cartUpdated, userCarts });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function checkout(req, res) {
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
        render(req, res, "checkout", { cart, shippingMethods });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

async function getShipping(req, res) {
    const userCarts = await service.getUserCarts(req.session.user._id);
    const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
    const selectedShippingMethod = req.query['selected-shipping-method'];
    if (!selectedShippingMethod) return res.end();
    const method = shippingMethods.find(method => method.name === selectedShippingMethod);
    res.render('components/cartCheckoutShippingMethod', { cart, method, user: req.session.user });
};

async function updateShipping(req, res) {
    const userCarts = await service.getUserCarts(req.session.user._id);
    const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
    cart.shipping.selectedMethod = req.body['selected-shipping-method'];
    const details = { ...req.body };
    delete details['selected-shipping-method'];
    cart.shipping.details.set(req.body['selected-shipping-method'], details);
    await cart.save();
    res.render('components/cartCheckoutShippingSelected', { cart, shippingMethods });
};

async function postOrder(req, res) {
    try {
        const userCarts = await service.getUserCarts(req.session.user._id);
        const cart = userCarts.find(cart => cart._id.toString() === req.session.active_cart?.toString());
        const order = await (await Order.create(Object.assign({}, cart.toObject(), { _id: null }, { number: await OrderNumber.add() }))).populate('user');

        if (!order) throw new Error("Order was not created.");

        const payUorder = {
            "notifyUrl": `${global.config.BASE_URL}/transaction/notify`,
            "continueUrl": `${global.config.BASE_URL}/transaction/status`,
            "customerIp": "127.0.0.1",
            "merchantPosId": `${global.config.PAYU.pos_id}`,
            "description": order.number,
            "currencyCode": "PLN",
            "totalAmount": Math.ceil(order.costSubtotal * 100),
            "buyer": {
                "email": order.user.email,
                "phone": "654111654",
                "firstName": "John",
                "lastName": "Doe",
                "language": "pl"
            },
            "products": [
                {
                    "name": "Order",
                    "unitPrice": Math.ceil(order.costSubtotal * 100),
                    "quantity": "1"
                }
            ]
        }

        const response = await payu.createOrder(payUorder);
        if (!response.ok) console.log(await response.text());

        res.set('HX-Redirect', response.url);
        await service.clearUserCart(req.session.user._id);
        res.end();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};
