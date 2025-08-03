/** @format */

const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    price: { type: Number },
    products: [
      {
        quantity: { type: Number },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        amount: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
