const express = require("express");
const router = express.Router();
const render = require("../utils/render.utils");
const controller = require('../controllers/auth.controller');
const { isAnonymus } = require("../middleware/user.middleware");

router.get('/', (req, res) => {
    const user = { access: req.session.user?.access };
    if (req.session.user?.email) user.email = req.session.user.email;
    res.send(user)
});
// router.get('/login', (req, res) => { res.render("components/loginEmailTokenForm") });
router.get('/login/token', (req, res) => { render(req, res, "login", { form: "loginEmailTokenForm", email: "" }) });
router.get('/logout', controller.logout);
router.get('/user/element', (req, res) => { res.render("components/user", { user: req.session.user }) });
router.get('/login/:hash', isAnonymus, controller.loginByHash);
router.post('/login', isAnonymus, controller.createToken);
router.post('/login/token', isAnonymus, controller.loginByEmailToken);

module.exports = router;
