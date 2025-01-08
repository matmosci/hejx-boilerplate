const Cart = require("../models/Cart.model");

module.exports = {
    getUserCartLength,
};

async function getUserCartLength(userId) {
    const cart = await getUserCart(userId);
    return cart.content.length;
};

async function getUserCart(userId) {
    return await Cart.findOne({ userId }) ?? await Cart.create({ userId });
};
