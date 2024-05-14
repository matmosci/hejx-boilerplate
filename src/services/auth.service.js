const User = require('../models/User.model.js');
const LoginToken = require('../models/LoginToken.model.js');
const crypto = require("crypto");

module.exports = {
    createLoginToken,
    getUserByLoginToken,
    getUserByLoginHash
};

async function createLoginToken(email) {
    const token = crypto.randomBytes(2).toString("hex").toUpperCase();
    const hash = crypto.randomBytes(48).toString("hex").toLowerCase();
    await LoginToken.create({ email, token, hash });
    return { token, hash };
}

async function getUserByLoginToken(email, token) {
    if (await LoginToken.verify(email, token))
        return await User.findOne({ email }) || await User.create({ email, access: 1 });
}

async function getUserByLoginHash(hash) {
    hash = crypto.createHash("sha256").update(hash).digest("hex");
    const loginToken = await LoginToken.findOne({ hash });
    if (!loginToken) return;
    const { email, token } = loginToken;
    if (await LoginToken.verify(email, token, false))
        return await User.findOne({ email }) || await User.create({ email, access: 1 });
}