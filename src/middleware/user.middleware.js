const User = require("../models/User.model");

module.exports = (req, res, next) => {
    if (req.session.user) return next();
    User.create({}).then(user => {
        req.session.user = { _id: user._id, access: user.access };
        next();
    });
};

module.exports.isAnonymus = (req, res, next) => {
    if (req.session.user.access === 0) return next();
    res.status(400).send(res.locals.__("E_USER_ALREADY_LOGGED_IN"));
};