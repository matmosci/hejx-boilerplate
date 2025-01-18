const Cart = require("../models/Cart.model");
const products = require("./products.service");
const { randomUUID } = require('crypto');
const { getPrice } = require("./prices.service");

module.exports = {
    getUserCart,
    getUserCartLength,
    addUserCartProduct,
    clearUserCart,
    removeUserCartProduct,
};

async function getUserCartLength(userId) {
    const cart = await getUserCart(userId);
    return cart.content.length;
};

async function getUserCart(userId) {
    const cart = await Cart.findOne({ userId }) ?? await Cart.create({ userId });
    calculateCartSubtotal(cart);
    await cart.save();
    return cart;
};

async function addUserCartProduct(userId, productConfig) {
    const cart = await getUserCart(userId);
    const { product: productName, configPath } = productConfig;
    const product = products.getProductConfigured(productName, configPath, true);
    if (!product) throw new Error("Product was not added to cart.");

    const id = randomUUID();
    const config = getCartProductConfig(product);
    const { name, title, quantity, prices } = product;
    const cartProduct = { id, name, title, config, prices, quantity };
    cart.content.push(cartProduct);
    calculateCartSubtotal(cart);
    await cart.save();
    return cart;
};

function calculateCartSubtotal(cart) {
    cart.costSubtotal = 0;
    const prices = [];
    cart.content.map(product => {
        product.prices.map(price => {
            prices.push(price);
        });
    });
    prices.map(price => {
        cart.costSubtotal += getPrice[price.source](price.id, price.qty) * price.qty;
    });
};

async function clearUserCart(userId) {
    const cart = await getUserCart(userId);
    cart.content = [];
    await cart.save();
    return cart;
};

async function removeUserCartProduct(userId, productId) {
    const cart = await getUserCart(userId);
    cart.content = cart.content.filter(product => product.id !== productId);
    await cart.save();
    return cart;
};

function getCartProductConfig(product) {
    const config = [];
    product.parameters.map(param => {
        const configObject = {
            param: {
                name: param.name,
                title: param.title
            },
            value: {}
        };
        switch (param.type) {
            case 'select':
                const selectedOption = param.options.find(o => o.selected);
                configObject.value.value = selectedOption.value;
                configObject.value.title = selectedOption.title;
                config.push(configObject);
                break;
            case 'number':
                configObject.value.value = Number(param.value);
                configObject.value.title = String(param.value);
                config.push(configObject);
                break;
        };
    });
    return config;
};

function calculateTotal() {
    createCartProductGroups()
};

function createCartProductGroups(

) { };
