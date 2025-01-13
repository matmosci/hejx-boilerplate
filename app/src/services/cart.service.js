const Cart = require("../models/Cart.model");
const products = require("./products.service");
const { randomUUID } = require('crypto');

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
    return await Cart.findOne({ userId }) ?? await Cart.create({ userId });
};

async function addUserCartProduct(userId, productConfig) {
    const cart = await getUserCart(userId);
    const { product: productName, configPath } = productConfig;
    const product = products.getProductConfigured(productName, configPath, true);
    if (!product) throw new Error("Product was not added to cart.");

    const id = randomUUID();
    const name = product.name;
    const title = product.title;
    const config = products.getParamConfig(product, configPath);
    const description = products.getParamConfigDescriptive(product, configPath);
    const quantity = Number(config.quantity) ?? null;
    const cartProduct = { id, name, title, config, description, quantity };
    cart.content.push(cartProduct);
    await cart.save();
    return cart;
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

function calculateTotal() {
    createCartProductGroups()
};

function createCartProductGroups(

) { };