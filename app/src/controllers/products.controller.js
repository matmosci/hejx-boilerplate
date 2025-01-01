const { getContainerGridItems, parseGridItem } = require("../services/products.service");
const render = require("../utils/render.utils");

module.exports = {
    getContainer: (req, res) => {
        const { category } = req.params;
        const categoryData = parseGridItem(category);
        render(req, res, "products", { items: getContainerGridItems(categoryData.name), title: categoryData.title });
    },
    getContainerMain: (req, res) => {
        render(req, res, "products", { items: getContainerGridItems("home"), title: "Products" });
    },
    getProduct: (req, res) => {
        res.end('getProduct');
    },
    getProductDefault: (req, res) => {
        res.end('getProductDefault');
    },
};

