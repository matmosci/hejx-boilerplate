const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const { isAnonymus } = require("../middleware/user.middleware");
const { access, Roles } = auth;

router.get('/', auth, access(Roles.USER), controller.get);
router.post('/login/:hash', isAnonymus, controller.loginHash);
router.post('/login', isAnonymus, controller.login);
router.get('/logout', controller.logout);

module.exports = router;
