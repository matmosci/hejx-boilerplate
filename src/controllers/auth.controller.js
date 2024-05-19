const service = require('../services/auth.service');

module.exports = {
    get: (req, res) => {
        res.render('user', { user: req.user });
    },
    login: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase();
        const loginToken = req.body?.token;

        try {
            if (!email) throw new Error("E_INVALID_CREDENTIALS");
            if (!loginToken) {
                const credentials = await service.createLoginToken(email);
                if (global.config.NODE_ENV === "development") console.log(credentials);
                return res.status(201).render("components/loginEmailTokenForm", { email });
            };
            const user = await service.getUserByLoginToken(email, loginToken);
            if (!user) throw new Error("E_INVALID_CREDENTIALS");
            await service.transferUserData(user._id, req.session.user_id);
            await service.removeAnonymusUser(req.session.user_id);
            req.session.user_id = user._id;
            res.redirect('/');
        } catch (error) {
            return res.status(401).send({ error: error.message });
        }
    },
    loginHash: async (req, res) => {
        const { hash } = req.params;

        try {
            const user = await service.getUserByLoginHash(hash);
            if (!user) throw new Error("E_INVALID_CREDENTIALS");
            await service.transferUserData(user._id, req.session.user_id);
            await service.removeAnonymusUser(req.session.user_id);
            req.session.user_id = user._id;
            res.end();
        } catch (error) {
            return res.status(401).send({ error: error.message });
        };
    },
    logout: async (req, res) => {
        await service.removeAnonymusUser(req.session.user_id);
        req.session.destroy();
        res.redirect(303, '/login');
    }
};
