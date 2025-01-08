const Cart = require("../models/Cart.model");
const products = require("./products.service");

module.exports = {
    getUserCart,
    getUserCartLength,
    addUserCartProduct,
    clearUserCart,
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
    const { product: productName, path } = productConfig;
    const product = products.getProductConfigured(productName, path, true);
    const name = product.name;
    const title = product.title;
    const config = products.getParamConfig(product, path);
    const description = products.getParamConfigDescriptive(product, path);
    const quantity = Number(config.quantity) ?? null;
    const cartProduct = { name, title, config, description, quantity };
    cart.content.push(cartProduct);
    await cart.save();
    return cart;
};

async function clearUserCart(userId) {
    const cart = await getUserCart(userId);
    cart.content = [];
    await cart.save();
    return cart;
}