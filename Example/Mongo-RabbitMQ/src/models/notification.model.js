/** @format */

const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
