const render = require("../utils/render.utils");

const {
    getProductConfigured,
} = require("../services/products.service");

const {
    getContainerGridItems,
    parseGridItem,
} = require("../services/catalog.service");

module.exports = {
    getContainerMain,
    getContainer,
    getProduct,
};

async function getProduct(req, res) {    
    try {
        const { name } = req.params;
        const configPath = req.headers['x-form-request'] === 'true' ? Object.values(req.query).join('/') : req.params[0];
        const product = await getProductConfigured(name, { configPath, userId: req.session.user._id });
        const url = `/products/${product.name}/${product.configPath}`;
        res.set(req.headers['hx-request'] ? "HX-Push-Url" : "X-Set-Url", url);
        render(req, res, "product", { product, title: product.title });
    } catch (error) {
        console.log(error);
        res.set(req.headers['hx-request'] ? "HX-Push-Url" : "X-Set-Url", "/products");
        getContainerMain(req, res);
    }
};

function getContainer(req, res) {
    try {
        const { category: categoryName } = req.params;
        const category = parseGridItem(categoryName);
        render(req, res, "products", { items: getContainerGridItems(category.name), title: category.title });
    } catch (error) {
        console.log(error);
        res.set(req.headers['hx-request'] ? "HX-Push-Url" : "X-Set-Url", "/products");
        getContainerMain(req, res);
    }
};

function getContainerMain(req, res) {
    try {
        render(req, res, "products", { items: getContainerGridItems("home"), title: "Products" });
    } catch (error) {
        console.log(error);
        res.set(req.headers['hx-request'] ? "HX-Push-Url" : "X-Set-Url", "/");
        render(req, res, "home")
    }
};