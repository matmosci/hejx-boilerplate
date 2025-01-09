const registry = require('./registry.service');

module.exports = {
    getContainerGridItems,
    parseGridItem
}

function getContainerGridItems(name) {
    if (!registry.findByNameAndType(name, 'container')?.enabled) return null;

    const { items } = require(`../../data/containers/${name}.json`);

    return items.map(item => item.name).map(parseGridItem).filter(Boolean);
};

function parseGridItem(name) {
    const item = registry.findByName(name);
    if (!item?.enabled) return null;

    const { type } = item;
    const link = `/products${type === 'container' ? '/category' : ''}/${name}`;
    const { title, imageUrl } = require(`../../data/${type}s/${name}.json`);

    return { name, title, imageUrl, link };
};