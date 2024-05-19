const User = require("../models/User.model");

module.exports = (req, res, next) => {
    if (req.session.user_id) return next();
    User.create({}).then(user => {
        req.session.user_id = user._id;
        next();
    });
};

module.exports.isAnonymus = (req, res, next) => {
    User.findById(req.session.user_id).then(user => {
        if (user.access === 0) return next();
        res.status(400).send({ error: "E_USER_ALREADY_LOGGED_IN" });
    });
};