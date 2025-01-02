const express = require("express");
const router = express.Router();
const render = require("../utils/render.utils");

router.get('/', (req, res) => { render(req, res, "home") });
router.get('/login', (req, res) => { render(req, res, "login", { form: "loginEmailForm" }) });
router.get('/login/token', (req, res) => { render(req, res, "login", { form: "loginEmailTokenForm", email: "" }) });

module.exports = router;