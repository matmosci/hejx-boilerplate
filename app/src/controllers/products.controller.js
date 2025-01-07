const render = require("../utils/render.utils");

const {
    getProductConfigured,
    getContainerGridItems,
    parseGridItem
} = require("../services/products.service");

module.exports = {
    getContainerMain,
    getContainer,
    getProduct
};

function getProduct(req, res) {
    const { name, 0: urn } = req.params;

    try {
        const product = getProductConfigured(name, urn);
        const url = `/products/${product.name}/${product.urn}`;
        res.set(req.headers['hx-request'] ? "HX-Push-Url" : "X-Set-Url", url);
        render(req, res, "product", { product, title: product.title });
    } catch (error) {
        console.log(error);
        res.set(req.headers['hx-request'] ? "HX-Push-Url" : "X-Set-Url", "/products");
        getContainerMain(req, res);
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