const mongoose = require("mongoose");

const cartProductSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        title: { type: String, required: true },
        config: { type: Object, required: true },
        prices: { type: [Object], required: true },
        quantity: { type: Number, default: null },
    },
    { _id: false }
);

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, required: true },
        content: { type: [cartProductSchema], default: [] },
        costSubtotal: { type: Number, default: 0 },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Cart", schema);
