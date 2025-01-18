const prices = require("../../data/prices.json");

function getJsonPrice(id, quantity) {
    const price = prices.find(p => p.id === id)?.price;
    if (!price) return null;

    if (typeof price === 'number') return price;
    if (Array.isArray(price)) {
        for (let i = price.length - 1; i >= 0; i--)
            if (quantity >= price[i][0]) return price[i][1];
    } else if (typeof price === 'object') {
        const keys = Object.keys(price).sort((a, b) => a - b);
        for (let i = keys.length - 1; i >= 0; i--)
            if (quantity >= keys[i]) return price[keys[i]];
    };

    return null;
};

module.exports.getPrice = { json: getJsonPrice };
