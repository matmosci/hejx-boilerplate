const registry = require('../../data/products-registry.json');

module.exports = { getContainerGridItems, parseGridItem };

function getContainerGridItems(name) {
    let container = registry.find(item => item.name === name && item.type === 'container');
    if (!container?.enabled) return null;

    const { items } = require(`../../data/containers/${name}.json`);
    return items.map(item => item.name).map(parseGridItem).filter(Boolean);
};

function parseGridItem(name) {
    let item = registry.find(item => item.name === name);
    if (!item?.enabled) return null;

    const { type } = item;
    const link = `/products${type === 'container' ? '/category' : ''}/${name}`;

    const { title, imageUrl } = require(`../../data/${type}s/${name}.json`);

    return { name, title, imageUrl, link };
};
