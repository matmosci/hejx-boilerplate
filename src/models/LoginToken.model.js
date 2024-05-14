const mongoose = require("mongoose");
const crypto = require("crypto");
const { LOGIN_TOKEN_EXPIRATION } = global.config;

const schema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        token: { type: String, required: true },
        hash: { type: String, required: true },
    },
    { timestamps: true }
);

schema.pre("save", function () {
    this.token = crypto.createHash("sha256").update(this.token).digest("hex");
    this.hash = crypto.createHash("sha256").update(this.hash).digest("hex");
});

schema.statics.verify = async function (email, token, hash) {
    const date = new Date(new Date().getTime() - LOGIN_TOKEN_EXPIRATION).toISOString();
    if (hash) token = crypto.createHash("sha256").update(token).digest("hex");
    const verified = await this.findOne({ email, token, createdAt: { $gte: date } });
    if (!verified) return false;
    await this.deleteMany({ email });
    return true;
};

module.exports = mongoose.model("LoginToken", schema);
