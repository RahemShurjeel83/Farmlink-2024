const AsyncHandler = require("express-async-handler");
const ProductModel = require("../../Models/AdminModel/ProductModel");
const OrderModel = require("../../Models/AdminModel/OrderModel");
const mongoose = require("mongoose");

/**
 * Returns products similar to a given product based on:
 * 1. Same category (highest weight)
 * 2. Overlapping price range (+/- 30%)
 * 3. Excludes the current product
 *
 * Each product is scored so the most relevant results appear first.
 * No external API required — fully server-side, zero cost.
 */
const getRecommendations = AsyncHandler(async (req, res) => {
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  const product = await ProductModel.findById(productId).lean();
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  const price = parseFloat(product.newPrice) || 0;
  const priceLow = price * 0.7;
  const priceHigh = price * 1.3;

  // Fetch candidates: same category or close price range, excluding self
  const candidates = await ProductModel.find({
    _id: { $ne: product._id },
    $or: [
      { categoryName: product.categoryName },
      { newPrice: { $gte: Math.floor(priceLow), $lte: Math.ceil(priceHigh) } },
    ],
  })
    .limit(20)
    .lean();

  // Score each candidate
  const scored = candidates.map((p) => {
    let score = 0;
    if (p.categoryName === product.categoryName) score += 10;
    const candidatePrice = parseFloat(p.newPrice) || 0;
    if (candidatePrice >= priceLow && candidatePrice <= priceHigh) score += 5;
    return { ...p, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  const recommendations = scored.slice(0, 6).map(({ _score, ...p }) => p);

  res.json({ success: true, data: recommendations });
});

/**
 * Returns trending products: those that appear most frequently in recent orders.
 * Falls back to newest products if no orders exist.
 */
const TRENDING_LIMIT = 6;

const getTrending = AsyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const orderAgg = await OrderModel.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: "$productname", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: TRENDING_LIMIT },
  ]);

  const trending = [];

  if (orderAgg.length > 0) {
    const productNames = orderAgg.map((o) => o._id);
    const products = await ProductModel.find({ productName: { $in: productNames } }).lean();

    // Multiple vendors can list the same product name, but the trending shelf should
    // showcase variety — each card already links to the shared /product/:slug page
    // where every vendor's offer is shown. So pick one (cheapest) representative
    // listing per trending name, in trending-rank order, instead of flooding the
    // shelf with several vendors' copies of the single most-ordered item.
    const cheapestByName = new Map();
    for (const p of products) {
      const current = cheapestByName.get(p.productName);
      if (!current || p.newPrice < current.newPrice) cheapestByName.set(p.productName, p);
    }
    for (const name of productNames) {
      const match = cheapestByName.get(name);
      if (match) trending.push(match);
    }
  }

  // Real order history is often thin (new marketplace, orphaned test orders, etc.),
  // so back-fill the rest of the shelf with the newest listings — keeps the section
  // from ever collapsing to a near-empty row while still prioritizing real trends first.
  if (trending.length < TRENDING_LIMIT) {
    const usedNames = new Set(trending.map((p) => p.productName));
    const excludeIds = trending.map((p) => p._id);
    const candidates = await ProductModel.find({ _id: { $nin: excludeIds } })
      .sort({ _id: -1 })
      .lean();

    for (const p of candidates) {
      if (trending.length >= TRENDING_LIMIT) break;
      if (usedNames.has(p.productName)) continue;
      trending.push(p);
      usedNames.add(p.productName);
    }
    // Still short (fewer distinct product names than the shelf size)? allow repeats.
    for (const p of candidates) {
      if (trending.length >= TRENDING_LIMIT) break;
      if (trending.includes(p)) continue;
      trending.push(p);
    }
  }

  res.json({ success: true, data: trending });
});

module.exports = { getRecommendations, getTrending };
