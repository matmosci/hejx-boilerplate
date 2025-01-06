const registry = require('../../data/items.json');
const path = require('path');
const XLSX = require("xlsx");
const XLSX_CALC = require("xlsx-calc");
const formulajs = require("@formulajs/formulajs");
XLSX_CALC.import_functions(formulajs, { override: true });

module.exports = {
    getProductConfigured,
    getProductParamNames,
    getProductDefaultParamValues,
    getProductDefinition,
    getContainerGridItems,
    parseGridItem
};

function getProductConfigured(name, config) {
    const item = registry.find(item => item.name === name && item.type === 'product');
    if (!item?.enabled) return null;

    const product = structuredClone(require(`../../data/products/${name}.json`));
    const reConfigArr = [];

    const { xcalc } = product;
    const xdoc_path = path.resolve(__dirname, `../../data/products/${xcalc.document}`);
    const workbook = XLSX.readFile(xdoc_path);
    const sheet = xcalc.sheet ?? workbook.SheetNames[0];

    product.parameters.map(param => {
        if (param.type === 'select' && !param.options.find(option => option.value === config[param.name])) {
            throw new Error(`Invalid option ${config[param.name]} for parameter ${param.name}`);
        };

        workbook.Sheets[sheet][param.cell].v = config[param.name];
    });

    XLSX_CALC(workbook, { continue_after_error: true, log_error: true });

    const parameters = product.parameters.map(param => {
        const value = config[param.name];

        if (param.enabled) {
            param.enabled = ["TRUE", 1, true].includes(workbook.Sheets[sheet][param.enabled].v);
        };

        if (param.type === 'number') {
            param.value = Number(value);
            if (param.min && typeof param.min === 'string') param.min = workbook.Sheets[sheet][param.min].v;
            if (param.max && typeof param.max === 'string') param.max = workbook.Sheets[sheet][param.max].v;
            if (Number(value) > param.max) param.value = param.max;
            if (Number(value) < param.min) param.value = param.min;

            reConfigArr.push(param.value);
        };
        if (param.type === 'select') {
            param.options.map(o => {
                delete o.selected;
                if (typeof o.enabled === 'string') o.enabled = ["TRUE", 1, true].includes(workbook.Sheets[sheet][o.enabled].v);
            });
            const selectedOption = param.enabled === false
                ? getFallbackOption(param.options)
                : findOptionSelectedOrEnabled(param.options, workbook.Sheets[sheet][param.cell].v);
            selectedOption.selected = true;
            reConfigArr.push(selectedOption.value);
        };
        return param;
    });

    return { product: { ...product, parameters }, reConfigArr };
};

function findOptionSelectedOrEnabled(options, value) {
    return options.find(option => option.value === value && option.enabled !== false) || options.find(option => option.enabled !== false);
};

function getFallbackOption(options) {
    return options.find(option => option.fallback === true);
}

function getContainerGridItems(name) {
    const item = registry.find(item => item.name === name && item.type === 'container');
    if (!item?.enabled) return null;

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
    const item = registry.find(item => item.name === name && item.type === 'product');
    if (!item?.enabled) return null;

    return require(`../../data/products/${name}.json`);
};

function getProductParamNames(name) {
    const item = registry.find(item => item.name === name && item.type === 'product');
    if (!item?.enabled) return null;

    const product = require(`../../data/products/${name}.json`);
    const paramNames = product.parameters.map(param => param.name);
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