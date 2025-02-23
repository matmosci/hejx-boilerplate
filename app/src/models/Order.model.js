const mongoose = require("mongoose");
const Cart = require("./Cart.model");

const schema = new mongoose.Schema(
    Object.assign({}, Cart.schema.obj, {
        number: { type: String, required: true },
    }),
);

const Order = mongoose.model("Order", schema);

module.exports = Order;
