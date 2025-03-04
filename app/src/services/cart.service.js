const { getProductConfigured } = require("./products.service");
const { randomUUID } = require('crypto');

const {
    getUserCart,
    calculateCartSubtotal,
} = require("../utils/cart.utils");

module.exports = {
    getUserCart,
    getUserCartLength,
    addUserCartProduct,
    updateUserCartProduct,
    clearUserCart,
    removeUserCartProduct,
};

async function getUserCartLength(userId) {
    const cart = await getUserCart(userId);
    return cart.content.length;
};

async function addUserCartProduct(userId, productConfig) {
    const cart = await getUserCart(userId);
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

async function updateUserCartProduct(userId, productId, productConfig) {
    const cart = await getUserCart(userId);
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

async function clearUserCart(userId) {
    const cart = await getUserCart(userId);
    cart.content = [];
    await cart.save();
    return cart;
};

async function removeUserCartProduct(userId, productId) {
    const cart = await getUserCart(userId);
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
