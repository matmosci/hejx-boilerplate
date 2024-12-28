const express = require("express");
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { isAnonymus } = require("../middleware/user.middleware");
const { auth, Roles } = require('../middleware/auth.middleware');;

router.get('/', auth(Roles.USER), controller.getUser);
router.get('/logout', controller.logout);
router.get('/login/:hash', isAnonymus, controller.loginByHash);
router.post('/login', isAnonymus, controller.createToken);
router.post('/login/token', isAnonymus, controller.loginByEmailToken);

module.exports = router;
