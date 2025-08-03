/** @format */

const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    amount: { type: Number },
    type: { type: String },
    payment_method: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
