const Cart = require("../models/Cart.model");
const { getProductConfigured } = require("./products.service");
const { randomUUID } = require('crypto');

const {
    getUserCart,
    calculateCartSubtotal,
} = require("../utils/cart.utils");

module.exports = {
    getUserCart, // legacy
    createUserCart,
    getUserCarts,
    getCart,
    deleteCart,
    getUserCartLength,
    addCartProduct,
    updateCartProduct,
    clearCart,
    removeCartProduct,
};

async function createUserCart(user) {
    return (await Cart.create({ user })).populate('user');
};

function getUserCarts(user) {
    return Cart.find({ user });
};

async function getCart(cartId) {
    const cart = await Cart.findById(cartId).populate('user');
    if (!cart) throw new Error("Cart not found.");
    calculateCartSubtotal(cart);
    await cart.save();
    return cart;
};

function deleteCart(cartId) {
    return Cart.findByIdAndDelete(cartId);
};

async function getUserCartLength(userId) {
    const cart = await getUserCart(userId);
    return cart.content.length;
};

async function addCartProduct(cartId, productConfig) {
    const cart = await getCart(cartId);
    const { product: productName, configPath } = productConfig;
    const product = await getProductConfigured(productName, { configPath, strict: true });
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

async function updateCartProduct(cartId, productId, productConfig) {
    const cart = await getCart(cartId);
    const cartProduct = cart.content.find(product => product.id === productId);
    const cartProductEdited = JSON.parse(JSON.stringify(cartProduct));
    for (const configParam of Object.entries(productConfig)) {
        if (configParam[0] === 'quantity') {
            if (configParam[1] === "++") {
                cartProductEdited.quantity++;
            } else if (configParam[1] === "--") {
                cartProductEdited.quantity--;
            } else {
                cartProductEdited.quantity = Number(configParam[1]);
            }
            continue;
        }
    }

    const product = await getProductConfigured(cartProductEdited.name, { configPath: [...cartProductEdited.config.map(cp => cp.value.value), cartProductEdited.quantity].join("/"), strict: true });
    if (product) {
        Object.assign(cartProduct, product)

        calculateCartSubtotal(cart);
        await cart.save();
    };

    cartProduct.expanded = true;

    return cart;
};

async function clearCart(cartId) {
    const cart = await getCart(cartId);
    cart.content = [];
    calculateCartSubtotal(cart);
    await cart.save();
    return cart;
};

async function removeCartProduct(cartId, productId) {
    const cart = await getCart(cartId);
    cart.content = cart.content.filter(product => product.id !== productId);
    calculateCartSubtotal(cart);
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
