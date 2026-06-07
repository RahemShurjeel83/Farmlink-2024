const mongoose = require("mongoose");

const ORDER_STATUS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const orderSchema = mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    number: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, trim: true, default: "Pakistan" },
    address: { type: String, required: true, trim: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    productname: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUS,
      default: "pending",
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Orders", orderSchema);

module.exports = OrderModel;
