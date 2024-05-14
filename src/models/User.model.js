const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        email: { type: String, minlength: [5, "Min 5 znaków"], maxlength: [64, "Max 64 znaki"], match: [/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, "Niepoprawny format"] },
        access: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
)

module.exports = mongoose.model("User", schema);
