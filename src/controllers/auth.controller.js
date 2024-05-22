const service = require('../services/auth.service');

module.exports = {
    get: (req, res) => {
        res.send(req.session.user);
    },
    createToken: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase();

        try {
            if (!email) throw new Error("E_INVALID_CREDENTIALS");
            const credentials = await service.createLoginToken(email);
            if (global.config.NODE_ENV === "development") console.log(credentials);
            return res.status(201).render("index", { content: "pages/login-token", email, user: req.session.user });
        } catch (error) {
            console.log(error.message);
            return res.status(401).send(error.message);
        }
    },
    login: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase();
        const loginToken = req.body?.token;

        try {
            if (!email || !loginToken || loginToken === '') throw new Error("E_INVALID_CREDENTIALS");
            const user = await service.getUserByLoginToken(email, loginToken);
            if (!user) throw new Error("E_INVALID_CREDENTIALS");
            await service.transferUserData(user.id, req.session.user.id);
            await service.removeAnonymusUser(req.session.user.id);
            req.session.user = { id: user.id, email: user.email, access: user.access };
            res.redirect('/');
        } catch (error) {
            console.log(error.message);
            return res.status(401).send(error.message);
        }
    },
    loginHash: async (req, res) => {
        const { hash } = req.params;

        try {
            const user = await service.getUserByLoginHash(hash);
            if (!user) throw new Error("E_INVALID_CREDENTIALS");
            await service.transferUserData(user.id, req.session.user.id);
            await service.removeAnonymusUser(req.session.user.id);
            req.session.user = { id: user.id, email: user.email, access: user.access };
            res.end();
        } catch (error) {
            return res.status(401).send({ error: error.message });
        };
    },
    logout: async (req, res) => {
        await service.removeAnonymusUser(req.session.user.id);
        req.session.destroy();
        res.redirect('/auth/login');
    }
};
