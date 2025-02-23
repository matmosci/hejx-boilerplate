const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    counter: { type: Number, required: true },
  },
  { timestamps: true }
);

schema.statics = {
  add: async () => {
    const now = new Date();
    const year = now.getFullYear();
    const currentYear = await OrderNumber.findOneAndUpdate({ year }, { $inc: { counter: 1 } }, { new: true, upsert: true });
    const orderNumber = `${currentYear.counter + 10000}/${currentYear.year.toString()}`;
    return orderNumber;
  },
};

const OrderNumber = mongoose.model("OrderNumber", schema);

module.exports = OrderNumber;
