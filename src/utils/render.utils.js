module.exports = function render(req, res, page, options = {}) {
    const content = `pages/${page}`;
    res.render("index", { content, user: req.session.user, ...options });
};