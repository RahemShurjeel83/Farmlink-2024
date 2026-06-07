const AsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ProductModel = require("../../Models/AdminModel/ProductModel");
const VendorModel = require("../../Models/vendorModel");
const ReviewModel = require("../../Models/AdminModel/ReviewModel");
const { haversineKm } = require("../../utils/geo");
const { slugify } = require("../../utils/slugify");

// Default buyer location used when the client doesn't share coordinates (Lahore)
const DEFAULT_BUYER_LOCATION = { lat: 31.5497, lng: 74.3436 };

const parseBuyerLocation = (req) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }
  return DEFAULT_BUYER_LOCATION;
};

const toListingView = (product, buyerLocation) => {
  const vendor = product.vendor || {};
  const distanceKm = haversineKm(buyerLocation, vendor.location || {});

  return {
    _id: product._id,
    productName: product.productName,
    description: product.description,
    productImage: product.productImage,
    newPrice: product.newPrice,
    oldPrice: product.oldPrice,
    quantity: product.quantity,
    isAvailable: product.isAvailable && product.quantity > 0,
    vendor: {
      _id: vendor._id,
      farmName: vendor.farmName || vendor.username,
      farmLogo: vendor.farmLogo || null,
      location: vendor.location || null,
      distanceKm,
      deliveryEstimateMins: vendor.deliveryEstimateMins,
      badges: vendor.badges || [],
      ratingAverage: vendor.ratingAverage || 0,
      ratingCount: vendor.ratingCount || 0,
    },
  };
};

// Returns every vendor's listing for a canonical product, grouped by productSlug
const getProductBySlug = AsyncHandler(async (req, res) => {
  const { slug } = req.params;
  const buyerLocation = parseBuyerLocation(req);

  const listings = await ProductModel.find({ productSlug: slug }).populate("vendor");

  if (!listings.length) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  const representative = listings[0];

  res.status(200).json({
    success: true,
    data: {
      productInfo: {
        productName: representative.productName,
        productSlug: representative.productSlug,
        description: representative.description,
        productImage: representative.productImage,
        categoryName: representative.categoryName,
      },
      listings: listings.map((listing) => toListingView(listing, buyerLocation)),
    },
  });
});

// Returns a farm's public profile: identity, rating, reviews, and current listings
const getVendorProfile = AsyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ success: false, message: "Invalid farm ID." });
  }

  const vendor = await VendorModel.findById(vendorId).select("-password");
  if (!vendor) {
    return res.status(404).json({ success: false, message: "Farm not found." });
  }

  const [listings, reviews] = await Promise.all([
    ProductModel.find({ vendor: vendorId }),
    ReviewModel.find({ vendor: vendorId }).sort({ createdAt: -1 }).limit(20),
  ]);

  res.status(200).json({
    success: true,
    data: {
      farm: {
        _id: vendor._id,
        farmName: vendor.farmName || vendor.username,
        farmLogo: vendor.farmLogo || null,
        farmCoverImage: vendor.farmCoverImage || null,
        farmDescription: vendor.farmDescription || "",
        location: vendor.location || null,
        deliveryRadiusKm: vendor.deliveryRadiusKm,
        deliveryEstimateMins: vendor.deliveryEstimateMins,
        badges: vendor.badges || [],
        ratingAverage: vendor.ratingAverage || 0,
        ratingCount: vendor.ratingCount || 0,
      },
      listings: listings.map((p) => ({
        _id: p._id,
        productName: p.productName,
        productSlug: p.productSlug || slugify(p.productName),
        productImage: p.productImage,
        newPrice: p.newPrice,
        oldPrice: p.oldPrice,
        quantity: p.quantity,
      })),
      reviews,
    },
  });
});

module.exports = { getProductBySlug, getVendorProfile };
