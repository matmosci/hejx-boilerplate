const registry = require('../../data/products-registry.json');

module.exports = { getProductConfigured, getProductParamNames, getProductDefaultParamValues, getProductDefinition, getContainerGridItems, parseGridItem };

function getProductConfigured(name, config) {
    const product = registry.find(item => item.name === name && item.type === 'product');
    if (!product?.enabled) return null;

    const productDefinition = require(`../../data/products/${name}.json`);
    const reConfigArr = [];
    let redirect = false;
    const parameters = productDefinition.parameters.map(param => {
        const value = config[param.name];
        if (param.type === 'number') {
            param.value = Number(value);
            if (Number(value) > param.max) {
                param.value = param.max;
                redirect = true;
            };
            if (Number(value) < param.min) {
                param.value = param.min;
                redirect = true;
            };
            reConfigArr.push(param.value);
        }
        if (param.type === 'select') {
            param.options.map(o => {
                delete o.selected;
            });
            const selectedOption = param.options.find(o => o.value === value)
            selectedOption.selected = true;
            reConfigArr.push(selectedOption.value);
        }
        return param;
    });

    return { product: { ...productDefinition, parameters }, reConfigArr, redirect };
};

function getContainerGridItems(name) {
    const container = registry.find(item => item.name === name && item.type === 'container');
    if (!container?.enabled) return null;

    const { items } = require(`../../data/containers/${name}.json`);

    return items.map(item => item.name).map(parseGridItem).filter(Boolean);
};

function parseGridItem(name) {
    const item = registry.find(item => item.name === name);
    if (!item?.enabled) return null;

    const { type } = item;
    const link = `/products${type === 'container' ? '/category' : ''}/${name}`;
    const { title, imageUrl } = require(`../../data/${type}s/${name}.json`);

    return { name, title, imageUrl, link };
};

function getProductDefinition(name) {
    const product = registry.find(item => item.name === name && item.type === 'product');
    if (!product?.enabled) return null;

    return require(`../../data/products/${name}.json`);
};

function getProductParamNames(name) {
    const product = registry.find(item => item.name === name && item.type === 'product');
    if (!product?.enabled) return null;

    const productDefinition = require(`../../data/products/${name}.json`);
    const paramNames = productDefinition.parameters.map(param => param.name);
    return paramNames;
};

function getProductDefaultParamValues(product) {
    return product.parameters.map(getProductDefaultParamValue);
};

function getProductDefaultParamValue(param) {
    switch (param.type) {
        case "number":
            return { name: param.name, value: param.value };
        case "select":
            return { name: param.name, value: param.options[0].value };
    }
    return param.type;
};