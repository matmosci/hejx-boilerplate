const {
    getProductDefaultParamValues,
    getProductDefinition,
    getContainerGridItems,
    parseGridItem
} = require("../services/products.service");
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
    getProduct: (req, res) => {
        res.end('getProduct');
    },
    getProductDefault: (req, res) => {
        const { product: productName } = req.params;
        const product = getProductDefinition(productName);
        const paramURN = getProductDefaultParamValues(product).map(p => p.value).join("/");
        res.set("HX-Push-Url", `/products/${product.name}/${paramURN}`);
        render(req, res, "product", { product, title: product.title });
    },
};
