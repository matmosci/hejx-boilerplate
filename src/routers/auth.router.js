const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { isAnonymus } = require("../middleware/user.middleware");
const { auth, Roles } = require('../middleware/auth.middleware');;

router.get('/', auth(Roles["USER"]), controller.get);
router.post('/login', isAnonymus, controller.login);
router.post('/login/token', isAnonymus, (req, res) => res.end()); // TODO
router.post('/login/:hash', isAnonymus, controller.loginHash);
router.get('/logout', controller.logout);
router.get('/login', (req, res) => res.render("index", { content: "pages/login-token", email: '', user: req.session.user }));

module.exports = router;
