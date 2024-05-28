const User = require('../models/User.model');
const LoginToken = require('../models/LoginToken.model');
const crypto = require("crypto");

module.exports = {
    createLoginToken,
    getUserByLoginToken,
    getUserByLoginHash,
    removeAnonymusUser,
    transferUserData: async (to_user_id, from_user_id) => {
        return console.log("moveUserData", to_user_id, from_user_id);
    }
};

async function createLoginToken(email) {
    const token = crypto.randomBytes(2).toString("hex").toUpperCase();
    const hash = crypto.randomBytes(48).toString("hex").toLowerCase();
    await LoginToken.create({ email, token, hash });
    return { token, hash };
}

async function getUserByLoginToken(user_id, email, token, hash = true) {
    if (await LoginToken.verify(email, token, hash))
        return await User.findOne({ email }) || await User.findByIdAndUpdate(user_id, { email, access: 1 }, { new: true, upsert: true });
}

async function getUserByLoginHash(user_id, hash) {
    hash = crypto.createHash("sha256").update(hash).digest("hex");
    const loginToken = await LoginToken.findOne({ hash });
    if (!loginToken) return;
    const { email, token } = loginToken;
    return await getUserByLoginToken(user_id, email, token, false);
}

async function removeAnonymusUser(_id) {
    // TODO remove anonymus data
    return await User.findOneAndDelete({ _id, access: 0 });
}
