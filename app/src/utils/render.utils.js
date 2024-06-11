module.exports = function render(req, res, page, options = {}) {
    const content = `pages/${page}`;
    res.status(options.$status || 200).render("index", { content, user: req.session.user, ...options });
};