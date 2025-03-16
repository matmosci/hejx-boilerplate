const csv = require('../utils/csv.utils');

function getJsonPrice(source, id, quantity) {
    const prices = require(`../../data/${source}`);
    const price = prices.find(p => p.id === Number(id))?.price;
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

function getCsvPrice(source, id, quantity) {
    const json = csv.toJson(source);
    return json.find(product => product.id === id)?.price;
}

function getPrice(source, id, quantity) {
    const type = source.split('.')[1];
    switch (type) {
        case 'json':
            return getJsonPrice(source, id, quantity);
        case 'csv':
            return getCsvPrice(source, id, quantity);
    };
}

module.exports = { getPrice };
