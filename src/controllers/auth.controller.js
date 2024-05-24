const service = require('../services/auth.service');

module.exports = {
    getUser: (req, res) => {
        res.send(req.session.user);
    },
    createToken: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase();

        try {
            if (!email) throw new Error("E_INVALID_CREDENTIALS");
            const credentials = await service.createLoginToken(email);
            if (global.config.NODE_ENV === "development") console.log(credentials);
            return res.status(201).render("index", { content: "pages/login", form: "loginEmailTokenForm", email, user: req.session.user });
        } catch (error) {
            if (error.message !== "E_INVALID_CREDENTIALS") console.log(error.message);
            return res.status(401).send(res.locals.__(error.message));
        }
    },
    loginByEmailToken: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase();
        const loginToken = req.body?.token?.trim().toUpperCase();

        try {
            if (!email || !loginToken) throw new Error("E_INVALID_CREDENTIALS");
            const user = await service.getUserByLoginToken(email, loginToken);
            if (!user) throw new Error("E_INVALID_CREDENTIALS");
            await service.transferUserData(user.id, req.session.user.id);
            await service.removeAnonymusUser(req.session.user.id);
            req.session.user = { id: user.id, email: user.email, access: user.access };
            res.redirect('/');
        } catch (error) {
            if (error.message !== "E_INVALID_CREDENTIALS") console.log(error.message);
            return res.status(401).send(res.locals.__(error.message));
        }
    },
    loginByHash: async (req, res) => {
        const { hash } = req.params;

        try {
            const user = await service.getUserByLoginHash(hash);
            if (!user) throw new Error("E_INVALID_CREDENTIALS");
            await service.transferUserData(user.id, req.session.user.id);
            await service.removeAnonymusUser(req.session.user.id);
            req.session.user = { id: user.id, email: user.email, access: user.access };
            res.redirect('/');
        } catch (error) {
            if (error.message !== "E_INVALID_CREDENTIALS") console.log(error.message);
            return res.status(401).send(res.locals.__(error.message));
        };
    },
    logout: async (req, res) => {
        await service.removeAnonymusUser(req.session.user.id);
        req.session.destroy();
        res.redirect('/auth/login');
    }
};
