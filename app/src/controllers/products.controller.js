const {
    getProductConfigured,
    getProductParamNames,
    getProductDefaultParamValues,
    getProductDefinition,
    getContainerGridItems,
    parseGridItem
} = require("../services/products.service");
const { keyValueArraysToObject } = require("../utils/common.utils");
const render = require("../utils/render.utils");

module.exports = {
    getContainer: (req, res) => {
        const { category: categoryName } = req.params;
        const category = parseGridItem(categoryName);
        render(req, res, "products", { items: getContainerGridItems(category.name), title: category.title });
    },
    getContainerMain: (req, res) => {
        render(req, res, "products", { items: getContainerGridItems("home"), title: "Products" });
    },
    getProductWithConfig: (req, res) => {
        const { product: productName, 0: configURN } = req.params;
        const configArr = configURN.split("/");
        try {
            const config = keyValueArraysToObject(getProductParamNames(productName), configArr);
            console.log(config); // dev
            const { product, reConfigArr, redirect } = getProductConfigured(productName, config);
            const url = `/products/${product.name}/${reConfigArr.join("/")}`;
            if (redirect && !req.headers['hx-request']) return res.redirect(url);
            res.set("HX-Push-Url", url);
            render(req, res, "product", { product, title: product.title });
        } catch (error) {
            console.log(error); // dev
            getProductDefault(req, res);
        }
    },
    getProductDefault
};

function getProductDefault(req, res) {
    try {
        const { product: productName } = req.params;
        const product = getProductDefinition(productName);
        const paramURN = getProductDefaultParamValues(product).map(p => p.value).join("/");
        const url = `/products/${product.name}/${paramURN}`;
        if (!req.headers['hx-request']) return res.redirect(url);
        res.set("HX-Push-Url", url);
        render(req, res, "product", { product, title: product.title });
    } catch (error) {
        const url = `/products`;
        if (!req.headers['hx-request']) return res.redirect(url);
        res.set("HX-Push-Url", url);
        render(req, res, "product", { product, title: product.title });
    }
};
