const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: Object,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["card", "fawry", "cash"],
      required: true,
      default: "cash",
    },
    status: {
      type: String,
      default: "order-placed",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Order", orderSchema);
