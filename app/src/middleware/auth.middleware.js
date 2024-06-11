const { isAccessToRole, Roles } = require("../utils/access.utils.js");

function auth(role) {
    return (req, res, next) => {
        if (!isAccessToRole(req.session.user.access, role)) return res.sendStatus(403);
        next();
    };
};

module.exports.Roles = Roles;
module.exports.auth = auth;
