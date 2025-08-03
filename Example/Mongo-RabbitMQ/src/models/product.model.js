/** @format */

const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String },
    description: { type: String },
    amount: { type: Number },
    units: { type: Number },
    status: {
      type: String,
      enum: ["in-stock", "delete", "out-stock"],
      default: "in-stock",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
