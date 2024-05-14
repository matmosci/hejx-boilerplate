const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware.js');
const { access, Roles } = auth;

router.get('/', auth, access(Roles.USER), controller.get);
router.post('/:hash', controller.loginHash);
router.post('/', controller.login);
router.delete('/', controller.logout);

module.exports = router;
