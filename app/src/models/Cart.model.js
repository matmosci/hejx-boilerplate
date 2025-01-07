const mongoose = require("mongoose");

const cartProductSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.Mixed, required: true },
        quantity: { type: Number, default: 1 },
    },
    { _id: false }
);

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, required: true },
        content: { type: [cartProductSchema], default: [] },
    },
    { timestamps: true }
)

// module.exports = mongoose.model("Cart", schema);

// debug:

const Cart = mongoose.model("Cart", schema);

(async () => {
    // await Cart.deleteMany();
    // await Cart.create({ userId: "6755dc32290fe07e12994ee5"});
    const carts = await Cart.find();
    console.log(carts);
})();


module.exports = Cart;
