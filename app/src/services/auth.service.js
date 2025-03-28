const User = require('../models/User.model');
const LoginToken = require('../models/LoginToken.model');
const Cart = require('../models/Cart.model');
const crypto = require("crypto");
const mailer = require('../utils/mailer.utils');

module.exports = {
    createLoginToken,
    sendLoginToken,
    getUserByLoginToken,
    getUserByLoginHash,
    removeAnonymusUser,
    transferUserData: async (to_user_id, from_user_id) => {
        const fromUserCarts = await Cart.find({ user: from_user_id });
        await Promise.all(fromUserCarts.map(async cart => {
            if (cart.content.length === 0) return await Cart.findByIdAndDelete(cart._id);
            cart.user = to_user_id;
            return await cart.save();
        }));
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

function sendLoginToken(email, credentials) {
    // TODO localize message
    const message = `
<p>Your login token: <strong>${credentials.token}</strong></p>
<p>You can also use this link to login: ${global.config.BASE_URL}/auth/login/${credentials.hash}</p>
`;
    mailer.send("Login Token", message, email);
}