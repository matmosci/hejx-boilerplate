const express = require("express");
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { isAnonymus } = require("../middleware/user.middleware");

router.get('/', (req, res) => {
    const user = { access: req.session.user?.access };
    if (req.session.user?.email) user.email = req.session.user.email;
    res.send(user)
});
router.get('/logout', controller.logout);
router.get('/user/menu', controller.getUserMenu);
router.get('/login/:hash', isAnonymus, controller.loginByHash);
router.post('/login', isAnonymus, controller.createToken);
router.post('/login/token', isAnonymus, controller.loginByEmailToken);

module.exports = router;
