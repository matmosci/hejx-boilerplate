const Cart = require("../models/Cart.model");
const { getPrice } = require("../services/prices.service");

module.exports = {
    getUserCart,
    createCartProductGroup,
    calculateCartSubtotal,
};

async function getUserCart(userId) {
    const cart = await Cart.findOne({ userId }) ?? await Cart.create({ userId });
    calculateCartSubtotal(cart);
    await cart.save();
    return cart;
};

function createCartProductGroup(product, content) {
    const productGroup = {};
    content.filter(p => p.name === product).map(p => {
        p.prices.map(price => {
            productGroup[price.source] ??= {};
            productGroup[price.source][price.id] ??= { qty: 0 };
            productGroup[price.source][price.id].qty += price.qty;
        });
    });

    Object.keys(productGroup).map(source => {
        Object.keys(productGroup[source]).map(id => {
            productGroup[source][id].price = getPrice[source](id, productGroup[source][id].qty);
        });
    });

    return productGroup;
};

function calculateCartSubtotal(cart) {
    const groups = {};
    getCartContentGroups(cart.content).map(group => {
        groups[group] = createCartProductGroup(group, cart.content);
    });

    cart.costSubtotal = 0;
    cart.content.map(product => {
        product.prices.map(price => {
            price.price = groups[product.name][price.source][price.id].price;
            cart.costSubtotal += price.price * price.qty;
        });
    });
};

function getCartContentGroups(content) {
    return Array.from(new Set(content.map(p => p.name)));
};