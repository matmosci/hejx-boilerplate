const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { isAnonymus } = require("../middleware/user.middleware");
const { auth, Roles } = require('../middleware/auth.middleware');;

router.get('/', auth(Roles["USER"]), controller.get);
router.post('/login/:hash', isAnonymus, controller.loginHash);
router.post('/login', isAnonymus, controller.login);
router.get('/logout', controller.logout);

module.exports = router;
