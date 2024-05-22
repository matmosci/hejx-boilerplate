const express = require("express");
const router = express.Router();

router.get('/', (req, res) => { getPage(req, res, "home") });
router.get('/query', (req, res) => { getPage(req, res, "query") });
router.get('/get', (req, res) => { getPage(req, res, "get") });
router.get('/form', (req, res) => { getPage(req, res, "form") });

function getPage(req, res, pageName) {
    const content = `pages/${pageName}`;
    const { query } = req;
    res.render("index", { content, query, user: req.session.user });
};

module.exports = router;