const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewerName: { type: String, required: true, trim: true },
    reviewerCity: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("Reviews", reviewSchema);

module.exports = ReviewModel;
