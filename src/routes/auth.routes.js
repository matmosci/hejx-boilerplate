const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const { isAnonymus } = require("../middleware/anonymus.middleware");
const { access, Roles } = auth;

router.get('/', auth, access(Roles.USER), controller.get);
router.post('/:hash', isAnonymus, controller.loginHash);
router.post('/', isAnonymus, controller.login);
router.delete('/', controller.logout);

module.exports = router;
