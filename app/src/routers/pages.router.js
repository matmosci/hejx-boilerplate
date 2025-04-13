const express = require("express");
const router = express.Router();
const render = require("../utils/render.utils");

router.get('/', (req, res) => { render(req, res, "home") });
router.get('/login', (req, res) => { render(req, res, "login", { form: "loginEmailForm", redirect: "/" }) });

module.exports = router;