const { isAccessToRole, Roles } = require("../utils/access.utils.js");
const User = require("../models/User.model.js");

async function auth(req, res, next) {
    if (req.session.user_id) req.user = await User.findById(req.session.user_id);
    if (!req.user) return res.sendStatus(401);
    next();
};

function access(role) {
    return (req, res, next) => {
        if (!isAccessToRole(req.user.access, role)) return res.sendStatus(403);
        next();
    };
};

module.exports = auth;
module.exports.Roles = Roles;
module.exports.access = access;

// // router example
// const auth = require("../middleware/auth.middleware.js");
// const { access, Roles } = auth;
// router.get("", auth, access(Roles.USER), controller.get);
