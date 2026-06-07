const AsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ReviewModel = require("../../Models/AdminModel/ReviewModel");
const VendorModel = require("../../Models/vendorModel");

const recalculateVendorRating = async (vendorId) => {
  const [stats] = await ReviewModel.aggregate([
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId) } },
    { $group: { _id: "$vendor", average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await VendorModel.findByIdAndUpdate(vendorId, {
    ratingAverage: stats ? Math.round(stats.average * 10) / 10 : 0,
    ratingCount: stats ? stats.count : 0,
  });
};

const getVendorReviews = AsyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ success: false, message: "Invalid farm ID." });
  }

  const reviews = await ReviewModel.find({ vendor: vendorId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: reviews });
});

const postVendorReview = AsyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  const { rating, comment, reviewerName, reviewerCity } = req.body;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ success: false, message: "Invalid farm ID." });
  }

  if (!rating || !comment) {
    return res.status(400).json({ success: false, message: "Rating and comment are required." });
  }

  const vendor = await VendorModel.findById(vendorId);
  if (!vendor) {
    return res.status(404).json({ success: false, message: "Farm not found." });
  }

  const review = await ReviewModel.create({
    vendor: vendorId,
    user: userId,
    reviewerName: reviewerName || "Anonymous Buyer",
    reviewerCity,
    rating,
    comment,
  });

  await recalculateVendorRating(vendorId);

  res.status(201).json({ success: true, data: review });
});

module.exports = { getVendorReviews, postVendorReview };
