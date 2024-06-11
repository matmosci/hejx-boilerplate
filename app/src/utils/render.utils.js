module.exports = function render(req, res, content, options = {}) {
    res.status(options.$status || 200).render("layout/index", { content, user: req.session.user, ...options });
};