const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
    {
        selectedMethod: { type: String },
        details: { type: Map, of: Object },
    },
    { _id: false, minimize: false }
);

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
        shipping: { type: shippingSchema, default: { selectedMethod: "", details: new Map() } },
        costSubtotal: { type: Number, default: 0 },
        costShipping: { type: Number, default: 0 },
        costTotal: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", schema);
