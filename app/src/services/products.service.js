const registry = require('./registry.service');
const path = require('path');
const XLSX = require("xlsx");
const XLSX_CALC = require("xlsx-calc");
const formulajs = require("@formulajs/formulajs");
XLSX_CALC.import_functions(formulajs, { override: true });
const { keyValueArraysToObject } = require("../utils/common.utils");

module.exports = {
    getProductConfigured,
    getParamConfig,
    getParamConfigDescriptive,
};

function getProductConfigured(name, urn, strict = false) {
    if (!registry.findByNameAndType(name, 'product')?.enabled) return null;

    const product = structuredClone(require(`../../data/products/${name}.json`));
    const config = getParamConfig(product, urn);

    const urnArr = [];

    const { xcalc } = product;
    const xdoc_path = path.resolve(__dirname, `../../data/products/${xcalc.document}`);
    const workbook = XLSX.readFile(xdoc_path);
    const sheet = xcalc.sheet ?? workbook.SheetNames[0];

    product.parameters.map(param => {
        if (param.type === 'select' && !param.options.find(option => option.value === config[param.name])) {
            if (strict) throw new Error(`Invalid option for parameter ${param.name}`);
            getProductConfigured(name, null);
        };

        if (strict && param.type === 'number' && (config[param.name] < param.min || config[param.name] > param.max)) {
            throw new Error(`Invalid value for parameter ${param.name}`);
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

            urnArr.push(param.value);
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
            urnArr.push(selectedOption.value);
        };
        return param;
    });

    product.urn = urnArr.join("/")
    product.parameters = parameters;

    return product;
};

function getParamConfig(product, urn) {
    const params = getProductParamNames(product);
    const values = urn ? urn.replace(/^\/|\/$/g, '').split("/") : getProductDefaultParamValues(product);

    return keyValueArraysToObject(params, values);
};

function getParamConfigDescriptive(product, urn) {
    const params = getProductParamTitles(product);
    const values = urn.replace(/^\/|\/$/g, '').split("/").map((value, index) => {
        const param = product.parameters[index];
        if (param.type === 'select') return param.options.find(option => option.value === value).title;
        return value;
    });

    return keyValueArraysToObject(params, values);
};

function findOptionSelectedOrEnabled(options, value) {
    return options.find(option => option.value === value && option.enabled !== false) || options.find(option => option.enabled !== false);
};

function getFallbackOption(options) {
    return options.find(option => option.fallback === true);
}

function getProductDefinition(name) {
    if (!registry.findByNameAndType(name, 'product')?.enabled) return null;

    return require(`../../data/products/${name}.json`);
};

function getProductParamNames(product) {
    return product.parameters.map(param => param.name);
};

function getProductParamTitles(product) {
    return product.parameters.map(param => param.title);
};

function getProductDefaultParamValues(product) {
    return product.parameters.map(getProductParamDefaultValue);
};

function getProductParamDefaultValue(param) {
    switch (param.type) {
        case "number":
            return String(param.value);
        case "select":
            return param.options[0].value;
    };
    return param.type;
};
