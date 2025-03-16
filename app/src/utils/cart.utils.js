const Cart = require("../models/Cart.model");
const { getPrice } = require("../services/prices.service");

module.exports = {
    getUserCart,
    createCartProductGroup,
    calculateCartSubtotal,
};

async function getUserCart(user) {
    const cart = await Cart.findOne({ user }).populate('user') ?? await (await Cart.create({ user })).populate('user');
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

    productGroup.subtotal = 0;

    Object.keys(productGroup).map(source => {
        Object.keys(productGroup[source]).map(id => {
            productGroup[source][id].price = getPrice(source, id, productGroup[source][id].qty);
            productGroup.subtotal += productGroup[source][id].price * productGroup[source][id].qty;
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
        });
    });

    Object.keys(groups).map(group => {
        cart.costSubtotal += groups[group].subtotal;
    });
};

function getCartContentGroups(content) {
    return Array.from(new Set(content.map(p => p.name)));
};
