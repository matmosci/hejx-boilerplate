const service = require("../services/auth.service");
const render = require("../utils/render.utils");

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
            else service.sendLoginToken(email, credentials);
            render(req, res, "login", { form: "loginEmailTokenForm", email, $status: 201 });
        } catch (error) {
            if (error.message === "E_INVALID_CREDENTIALS") return res.status(401).send(res.locals.__(error.message));
            console.log(error);
            res.sendStatus(500);
        }
    },
    loginByEmailToken: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase();
        const loginToken = req.body?.token?.trim().toUpperCase();

        try {
            if (!email || !loginToken) throw new Error("E_INVALID_CREDENTIALS");
            const user = await service.getUserByLoginToken(req.session.user._id, email, loginToken);
            await loginUser(req, res, user);
        } catch (error) {
            if (error.message === "E_INVALID_CREDENTIALS") return res.status(401).send(res.locals.__(error.message));
            console.log(error);
            res.sendStatus(500);
        }
    },
    loginByHash: async (req, res) => {
        const { hash } = req.params;

        try {
            const user = await service.getUserByLoginHash(req.session.user._id, hash);
            if (!user) throw new Error("E_INVALID_CREDENTIALS");
            await loginUser(req, res, user);
        } catch (error) {
            if (error.message === "E_INVALID_CREDENTIALS") return res.status(401).send(res.locals.__(error.message));
            console.log(error);
            res.sendStatus(500);
        }
    },
    logout: async (req, res) => {
        try {
            await service.removeAnonymusUser(req.session.user._id);
            req.session.destroy();
            res.redirect("/login");
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
};

async function loginUser(req, res, user) {
    if (!user) throw new Error("E_INVALID_CREDENTIALS");
    await service.transferUserData(user._id, req.session.user._id);
    await service.removeAnonymusUser(req.session.user._id);
    req.session.user = { _id: user._id, email: user.email, access: user.access };
    res.redirect("/");
}
