const { keyValueArraysToObject } = require("../utils/common.utils");
const render = require("../utils/render.utils");
const {
    getProductConfigured,
    getProductParamNames,
    getProductDefaultParamValues,
    getProductDefinition,
    getContainerGridItems,
    parseGridItem
} = require("../services/products.service");

module.exports = {
    getContainerMain,
    getContainer,
    getProductDefault,
    getProductWithConfig
};

function getProductDefault(req, res) {
    const { product: productName } = req.params;
    try {
        const product = getProductDefinition(productName);
        const paramURN = getProductDefaultParamValues(product).map(p => p.value).join("/");
        const url = `/products/${product.name}/${paramURN}`;
        res.set("HX-Push-Url", url);
        render(req, res, "product", { product, title: product.title });
    } catch (error) {
        getContainerMain(req, res);
    }
};

function getProductWithConfig(req, res) {
    const { product: productName, 0: configURN } = req.params;
    const configArr = configURN.split("/");
    try {
        const config = keyValueArraysToObject(getProductParamNames(productName), configArr);
        console.log(config); // dev
        const { product, reConfigArr } = getProductConfigured(productName, config);
        const url = `/products/${product.name}/${reConfigArr.join("/")}`;
        res.set("HX-Push-Url", url);
        render(req, res, "product", { product, title: product.title });
    } catch (error) {
        console.log(error); // dev
        getProductDefault(req, res);
    }
};

function getContainer(req, res) {
    const { category: categoryName } = req.params;
    const category = parseGridItem(categoryName);
    render(req, res, "products", { items: getContainerGridItems(category.name), title: category.title });
};

function getContainerMain(req, res) {
    render(req, res, "products", { items: getContainerGridItems("home"), title: "Products" });
};