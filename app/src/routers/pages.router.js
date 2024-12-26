const express = require("express");
const router = express.Router();
const render = require("../utils/render.utils");

router.get('/', (req, res) => { render(req, res, "home") });
router.get('/shop', (req, res) => { render(req, res, "shop", { products: require("../../data/products.json") }) });
router.get('/query', (req, res) => { render(req, res, "query", { show: req.query.show }) });
router.get('/get', (req, res) => { render(req, res, "get") });
router.get('/form', (req, res) => { render(req, res, "form") });
router.get('/login', (req, res) => { render(req, res, "login", { form: "loginEmailForm" }) });
router.get('/login/token', (req, res) => { render(req, res, "login", { form: "loginEmailTokenForm", email: "" }) });

module.exports = router;