const registry = require('./registry.service');
const fs = require('fs');
const path = require('path');
const { parse } = require("csv-parse/sync");

module.exports = {
    getContainerGridItems,
    parseGridItem,
    getContainerGridItemsCsv,
}

function getContainerGridItems(name) {
    if (!registry.findByNameAndType(name, 'container')?.enabled) return null;

    const { items } = require(`../../data/containers/${name}.json`);
    const itemsToParse = [];

    items.map(item => {
        if (item.type === 'csv') {
            let json = getContainerGridItemsCsv(item.name);
            if (item.filter) {
                Object.entries(item.filter).map(entry => {
                    json = json.filter(item => entry[1].includes(item[entry[0]]));
                });
            };
            return json.map(item => {
                itemsToParse.push({ ...item, type: 'csv' });
            });

        }
        return itemsToParse.push(item);
    })

    return itemsToParse.map(item => {
        return item.type === 'csv' ? parseGridItemCsv(item) : parseGridItem(item.name);
    }).filter(Boolean);
};

function parseGridItem(name) {
    const item = registry.findByName(name);
    if (!item?.enabled) return null;

    const { type } = item;
    const link = `/products${type === 'container' ? '/category' : ''}/${name}`;
    const { title, imageUrl } = require(`../../data/${type}s/${name}.json`);

    return { name, title, imageUrl, link };
};

function getContainerGridItemsCsv(fileName) {
    const filePath = path.join(__dirname, `../../data/${fileName}.csv`);
    data = fs.readFileSync(filePath);
    const json = parse(data, { columns: true, skip_empty_lines: true, relax_column_count: true });
    return json;
};

function parseGridItemCsv(item) {
    return {
        name: item.name.toLowerCase().replace(/ /g, '-'),
        title: item.name,
        imageUrl: item.image_0,
        link: `/products/${item.name.toLowerCase().replace(/ /g, '-')}`
    };
}