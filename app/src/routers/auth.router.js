const express = require("express");
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { isAnonymus } = require("../middleware/user.middleware");

router.get('/', controller.getUser);
router.get('/logout', controller.logout);
router.get('/user/menu', controller.getUserMenu);
router.get('/login', (req, res) => { res.redirect("/login"); });
router.get('/login/:hash', isAnonymus, controller.loginByHash);
router.post('/login', isAnonymus, controller.createToken);
router.post('/login/token', isAnonymus, controller.loginByEmailToken);

module.exports = router;
