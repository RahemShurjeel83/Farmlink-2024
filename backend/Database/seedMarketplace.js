const fs = require("fs");
const path = require("path");
const ProductModel = require("../Models/AdminModel/ProductModel");
const VendorModel = require("../Models/vendorModel");
const ReviewModel = require("../Models/AdminModel/ReviewModel");
const { slugify } = require("../utils/slugify");
const { buildFarmLogoSvg, buildFarmCoverSvg } = require("../utils/farmImages");
const { baseImageUrl } = require("../config");

const IMAGES_DIR = path.join(__dirname, "../public/Images");

// Approximate city centers used to place farms on the map for the "distance" feature
const CITIES = [
  { city: "Lahore", lat: 31.5497, lng: 74.3436 },
  { city: "Karachi", lat: 24.8607, lng: 67.0011 },
  { city: "Islamabad", lat: 33.6844, lng: 73.0479 },
  { city: "Rawalpindi", lat: 33.5651, lng: 73.0169 },
  { city: "Faisalabad", lat: 31.4504, lng: 73.1350 },
  { city: "Multan", lat: 30.1575, lng: 71.5249 },
  { city: "Gujranwala", lat: 32.1877, lng: 74.1945 },
  { city: "Sialkot", lat: 32.4945, lng: 74.5229 },
  { city: "Bahawalpur", lat: 29.3956, lng: 71.6722 },
  { city: "Peshawar", lat: 34.0151, lng: 71.5249 },
];

// ~22 names so seedMockVendorAccounts() can populate a 20-25-farm marketplace
const FARM_NAMES = [
  "Ali Farms", "Green Valley Farms", "Fresh Rabbit Co", "Lahore Organic Farm",
  "Karachi Coastal Dairy", "Margalla Hills Poultry", "Potohar Meat House",
  "Chenab Agro Farms", "Multan Mango & Orchard Co", "Punjab Kissan Bazaar",
  "Punjab Organic Farms", "Fresh Harvest Pakistan", "Noor Livestock Farm",
  "Riverbank Farms", "Prime Rabbit Farms", "Lahore Fresh Produce",
  "Northern Fields Dairy", "FarmDirect PK", "Sialkot Sahiwal Dairy",
  "Gujranwala Grain Farms", "Bahawalpur Date & Orchard Co", "Peshawar Poultry House",
];

const FARM_STORIES = [
  "A family-run farm supplying fresh, ethically raised produce straight to your door.",
  "Three generations of farming experience, now bringing village-fresh quality to the city.",
  "We raise our animals on open pasture with natural feed and no shortcuts.",
  "Small-batch, carefully inspected produce — quality over quantity, every harvest.",
  "From our fields to your table within 24 hours of harvest.",
  "Started as a single roadside stall, now serving thousands of households across the region.",
  "We work directly with local growers to cut out the middleman and keep prices fair.",
  "Certified, inspected, and proud of it — every batch is checked before it ships.",
];

const BADGE_POOL = ["Verified Farm", "Organic Feed", "Fresh Daily", "Halal Certified", "Top Seller", "Locally Sourced"];

// First-name + surname-initial pools used to generate realistic-looking,
// non-repeating Pakistani reviewer names (e.g. "Hamza T.") on demand.
const REVIEWER_FIRST_NAMES = [
  "Ahmed", "Ali", "Hassan", "Bilal", "Hamza", "Usman", "Imran", "Tariq", "Faisal", "Asad",
  "Kamran", "Saad", "Zain", "Umar", "Waqas", "Sana", "Ayesha", "Fatima", "Mehwish", "Hira",
  "Mariam", "Sara", "Iqra", "Zainab", "Nida", "Komal", "Rabia", "Amna", "Sadia", "Mahnoor",
];
const REVIEWER_SURNAME_INITIALS = ["A", "B", "F", "G", "H", "J", "K", "M", "N", "Q", "R", "S", "T", "W", "Z"];

// Comment pools grouped by sentiment so the generated rating and comment agree.
const REVIEW_COMMENTS = {
  positive: [
    "Fresh produce, excellent packaging and on-time delivery.",
    "Best quality I've ordered online, will definitely buy again.",
    "Reliable farm, consistent quality every time I order.",
    "Tastes like it was picked this morning — really impressed.",
    "Quick delivery and everything arrived in perfect condition.",
    "Highly recommend, the quality is consistently top-notch.",
    "Exactly as described, five stars from me.",
    "The freshest produce I've had delivered to my door.",
    "Excellent service, very professional and prompt.",
    "Great cuts and very clean — my family loved it.",
    "Couldn't ask for better quality at this price.",
    "Packaging was careful and everything stayed fresh.",
  ],
  mixedPositive: [
    "Good price, delivery was a little slower than expected.",
    "Great packaging, slightly pricey but worth it overall.",
    "Quality was good, though one item was a bit bruised.",
    "Would've given five stars if delivery was a touch faster.",
    "Nice quality, just wish the portions were a bit bigger.",
    "Pretty good experience overall, minor delay in delivery.",
    "Fresh enough, though the packaging could be improved.",
    "Solid order — a couple of small things could be better.",
  ],
  mixed: [
    "Average experience — quality was okay but not exceptional.",
    "It was fine, nothing special but it did the job.",
    "Decent for the price, though delivery took longer than expected.",
    "Mixed feelings — some items were great, others less so.",
  ],
};

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomOffset = () => (Math.random() - 0.5) * 0.3; // up to roughly +/-15km
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateReviewerName = () => `${randomItem(REVIEWER_FIRST_NAMES)} ${randomItem(REVIEWER_SURNAME_INITIALS)}.`;

// Skews toward positive ratings (real review distributions cluster at 4-5 stars)
// and keeps the comment's tone consistent with the rating it's attached to.
const generateReview = () => {
  const roll = Math.random();
  let rating;
  let pool;
  if (roll < 0.5) { rating = 5; pool = REVIEW_COMMENTS.positive; }
  else if (roll < 0.85) { rating = 4; pool = REVIEW_COMMENTS.mixedPositive; }
  else if (roll < 0.97) { rating = 3; pool = REVIEW_COMMENTS.mixed; }
  else { rating = 4; pool = REVIEW_COMMENTS.mixedPositive; }

  return {
    reviewerName: generateReviewerName(),
    reviewerCity: randomItem(CITIES).city,
    rating,
    comment: randomItem(pool),
  };
};

// An older schema version enforced a unique index on productName. The current
// schema allows multiple vendors to list the same product (that's the whole
// point of "Available From Nearby Farms"), so this stale constraint just blocks
// cross-vendor listings. Drop it if Mongo still has it from a previous boot.
const dropStaleProductNameUniqueIndex = async () => {
  const indexes = await ProductModel.collection.indexes();
  const staleIndex = indexes.find((idx) => idx.unique && idx.key && idx.key.productName);
  if (!staleIndex) return;

  await ProductModel.collection.dropIndex(staleIndex.name);
  console.log(`Marketplace migration: dropped stale unique index "${staleIndex.name}" on productName.`);
};

// One-time backfill: existing Product docs may have string price/quantity (legacy schema)
// and won't have a productSlug yet (it's only set by the pre-validate hook on new saves).
const backfillProductFields = async () => {
  const products = await ProductModel.find({});
  let updated = 0;

  for (const product of products) {
    let dirty = false;

    if (!product.productSlug) {
      product.productSlug = slugify(product.productName);
      dirty = true;
    }
    if (typeof product.newPrice !== "number") {
      product.newPrice = Number(product.newPrice) || 0;
      dirty = true;
    }
    if (typeof product.oldPrice !== "number") {
      product.oldPrice = Number(product.oldPrice) || 0;
      dirty = true;
    }
    if (typeof product.quantity !== "number") {
      product.quantity = Number(product.quantity) || 0;
      dirty = true;
    }

    if (dirty) {
      await product.save();
      updated += 1;
    }
  }

  if (updated > 0) {
    console.log(`Marketplace migration: backfilled ${updated} product(s) with slug/numeric fields.`);
  }
};

// Some legacy seed products reference a vendor ID that no longer exists in the
// database (orphaned reference). Relink them round-robin across real vendors so
// every product has a sellable, demoable listing instead of an empty seller list.
const relinkOrphanedProducts = async () => {
  const vendors = await VendorModel.find({}).select("_id");
  if (!vendors.length) return;

  const vendorIds = new Set(vendors.map((v) => v._id.toString()));
  const products = await ProductModel.find({});
  let relinked = 0;

  for (const product of products) {
    const vendorId = product.vendor ? product.vendor.toString() : null;

    if (!vendorId || !vendorIds.has(vendorId)) {
      product.vendor = vendors[relinked % vendors.length]._id;
      await product.save();
      relinked += 1;
    }
  }

  if (relinked > 0) {
    console.log(`Marketplace migration: relinked ${relinked} product(s) from missing vendors to active farms.`);
  }
};

// Account shells for the mock farms created by seedMockVendorAccounts — they need
// a username/email/password (Vendor is also a login-able User-like account) but
// their farm identity is filled in afterward by seedVendorFarmProfiles.
const MOCK_VENDOR_PASSWORD = "FarmLink@2026";
const TARGET_VENDOR_COUNT = 22;

const seedMockVendorAccounts = async () => {
  const existingCount = await VendorModel.countDocuments();
  const needed = TARGET_VENDOR_COUNT - existingCount;
  if (needed <= 0) return;

  let created = 0;
  let suffix = existingCount + 1;
  while (created < needed) {
    const username = `mockfarm${suffix}`;
    const email = `mockfarm${suffix}@farmlink.pk`;
    suffix += 1;

    // eslint-disable-next-line no-await-in-loop
    const exists = await VendorModel.exists({ $or: [{ username }, { email }] });
    if (exists) continue;

    // eslint-disable-next-line no-await-in-loop
    await VendorModel.create({ username, email, password: MOCK_VENDOR_PASSWORD });
    created += 1;
  }

  if (created > 0) {
    console.log(`Marketplace seed: created ${created} mock vendor account(s) to populate the marketplace (login: mockfarmN@farmlink.pk / ${MOCK_VENDOR_PASSWORD}).`);
  }
};

// Gives every farm without marketplace identity fields a realistic mock profile
const seedVendorFarmProfiles = async () => {
  const vendors = await VendorModel.find({ $or: [{ farmName: { $exists: false } }, { farmName: "" }, { farmName: null }] });
  if (!vendors.length) return;

  const namedVendors = await VendorModel.find({ farmName: { $exists: true, $nin: [null, ""] } }).select("farmName");
  const usedNames = new Set(namedVendors.map((v) => v.farmName));

  for (const vendor of vendors) {
    const base = randomItem(CITIES);
    const farmName = FARM_NAMES.find((n) => !usedNames.has(n)) || `${vendor.username}'s Farm`;
    usedNames.add(farmName);

    vendor.farmName = farmName;
    vendor.farmDescription = randomItem(FARM_STORIES);
    vendor.location = {
      city: base.city,
      address: `${base.city}, Pakistan`,
      lat: base.lat + randomOffset(),
      lng: base.lng + randomOffset(),
    };
    vendor.deliveryRadiusKm = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
    vendor.deliveryEstimateMins = [30, 45, 60, 90][Math.floor(Math.random() * 4)];

    const badgeCount = 1 + Math.floor(Math.random() * 3);
    const shuffled = [...BADGE_POOL].sort(() => Math.random() - 0.5);
    vendor.badges = shuffled.slice(0, badgeCount);

    await vendor.save();
  }

  console.log(`Marketplace seed: created farm profiles for ${vendors.length} vendor(s).`);
};

// Mock farms come back from seedVendorFarmProfiles with no farmLogo/farmCoverImage,
// so the UI shows letter-avatar fallbacks and a flat-color cover banner. Generate
// theme-matched SVG artwork (palette + icon derived from the farm's name/type) and
// serve it through the existing /Images static route + baseImageUrl convention —
// the same way uploaded product/category images are referenced.
const seedFarmImages = async () => {
  const vendors = await VendorModel.find({
    farmName: { $exists: true, $nin: [null, ""] },
    $or: [{ farmLogo: { $in: [null, ""] } }, { farmCoverImage: { $in: [null, ""] } }],
  });
  if (!vendors.length) return;

  for (const vendor of vendors) {
    const slug = slugify(vendor.farmName) || vendor._id.toString();
    const city = (vendor.location && vendor.location.city) || "Pakistan";

    if (!vendor.farmLogo) {
      const filename = `farm-logo-${slug}-${vendor._id}.svg`;
      fs.writeFileSync(path.join(IMAGES_DIR, filename), buildFarmLogoSvg(vendor.farmName), "utf8");
      vendor.farmLogo = baseImageUrl + filename;
    }

    if (!vendor.farmCoverImage) {
      const filename = `farm-cover-${slug}-${vendor._id}.svg`;
      fs.writeFileSync(path.join(IMAGES_DIR, filename), buildFarmCoverSvg(vendor.farmName, city), "utf8");
      vendor.farmCoverImage = baseImageUrl + filename;
    }

    await vendor.save();
  }

  console.log(`Marketplace seed: generated logo/cover artwork for ${vendors.length} farm(s).`);
};

// Gives every farm without reviews a batch of generated mock reviews (rating +
// comment + reviewer name/city all drawn from pools, not fixed templates, so a
// 20+ farm marketplace doesn't show the same handful of reviews everywhere) and
// recomputes its rating aggregate. Sized so the whole marketplace lands in the
// realistic 150-300 review range called for in the brief.
const TOTAL_REVIEW_TARGET_MIN = 150;
const TOTAL_REVIEW_TARGET_MAX = 300;

const seedVendorReviews = async () => {
  const vendors = await VendorModel.find({ ratingCount: { $eq: 0 } });
  if (!vendors.length) return;

  const existingTotal = await ReviewModel.countDocuments();
  const remainingBudget = Math.max(0, TOTAL_REVIEW_TARGET_MAX - existingTotal);
  if (remainingBudget === 0) return;

  // Spread the remaining budget evenly-ish across the unreviewed vendors, biased
  // toward the lower bound so a second seed run still has headroom if more farms appear.
  const perVendorMin = Math.max(3, Math.floor(TOTAL_REVIEW_TARGET_MIN / Math.max(vendors.length, 1)));
  const perVendorMax = Math.min(15, Math.max(perVendorMin + 2, Math.floor(remainingBudget / Math.max(vendors.length, 1)) + 2));

  let seeded = 0;
  let totalCreated = 0;

  for (const vendor of vendors) {
    const existing = await ReviewModel.countDocuments({ vendor: vendor._id });
    if (existing > 0) continue;
    if (totalCreated >= remainingBudget) break;

    const reviewCount = Math.min(randomInt(perVendorMin, perVendorMax), remainingBudget - totalCreated);
    if (reviewCount <= 0) break;

    const generated = Array.from({ length: reviewCount }, generateReview);
    await ReviewModel.insertMany(generated.map((r) => ({ ...r, vendor: vendor._id })));

    const average = generated.reduce((sum, r) => sum + r.rating, 0) / generated.length;
    vendor.ratingAverage = Math.round(average * 10) / 10;
    vendor.ratingCount = generated.length;
    await vendor.save();

    seeded += 1;
    totalCreated += generated.length;
  }

  if (seeded > 0) {
    console.log(`Marketplace seed: generated ${totalCreated} mock review(s) across ${seeded} vendor(s).`);
  }
};

// Each canonical product (grouped by productSlug) should be sellable by several
// farms so buyers can compare and pick a seller. Clones thin on listings get
// extra per-vendor copies (slight price/quantity variance) until a minimum is met.
const MIN_LISTINGS_PER_PRODUCT = 5;

// Test/placeholder products (e.g. "TestCarrot_1700818335445") must never be
// cloned across vendors — that's exactly how 2 stray test entries became 6
// customer-visible listings before this filter existed.
const TEST_PRODUCT_NAME_PATTERN = /test|placeholder|sample|demo|dummy|_\d{10,}/i;

// Shared by seedCrossVendorListings and seedFarmShowcaseListings: clones a
// product's catalog details onto a different vendor with slight price/quantity
// variance, so the same item looks like an independent listing per farm.
const cloneListingForVendor = (template, vendorId) => {
  const variance = 0.85 + Math.random() * 0.3; // +/- ~15% so prices differ across farms
  return ProductModel.create({
    categoryName: template.categoryName,
    productName: template.productName,
    description: template.description,
    productImage: template.productImage,
    newPrice: Math.max(1, Math.round(template.newPrice * variance)),
    oldPrice: Math.max(1, Math.round(template.oldPrice * variance)),
    quantity: Math.max(1, Math.round(template.quantity * (0.5 + Math.random() * 1.5))),
    isAvailable: true,
    vendor: vendorId,
    category: template.category,
  });
};

const seedCrossVendorListings = async () => {
  const vendors = await VendorModel.find({}).select("_id");
  if (vendors.length < 2) return;

  const products = await ProductModel.find({});
  const bySlug = new Map();
  for (const product of products) {
    if (TEST_PRODUCT_NAME_PATTERN.test(product.productName)) continue;
    const group = bySlug.get(product.productSlug) || [];
    group.push(product);
    bySlug.set(product.productSlug, group);
  }

  let created = 0;

  for (const group of bySlug.values()) {
    if (group.length >= MIN_LISTINGS_PER_PRODUCT) continue;

    const template = group[0];
    const usedVendorIds = new Set(group.map((p) => p.vendor.toString()));
    // Shuffle so the same handful of long-lived vendors don't keep absorbing
    // every new listing — otherwise newer farms stay empty shells forever.
    const candidates = vendors
      .filter((v) => !usedVendorIds.has(v._id.toString()))
      .sort(() => Math.random() - 0.5);
    const needed = Math.min(MIN_LISTINGS_PER_PRODUCT - group.length, candidates.length);

    for (let i = 0; i < needed; i++) {
      await cloneListingForVendor(template, candidates[i]._id);
      created += 1;
    }
  }

  if (created > 0) {
    console.log(`Marketplace seed: created ${created} cross-vendor listing(s) so products show multiple farms.`);
  }
};

// Mock farms from seedMockVendorAccounts start with zero products of their own —
// seedCrossVendorListings only tops up thin product groups, so most of them would
// still render as an empty "no active listings" shell on their farm profile page.
// Give every named farm a small baseline assortment (cloned from the canonical
// catalog, skipping items it already carries) so each one has something to sell.
const MIN_LISTINGS_PER_FARM = 3;

const seedFarmShowcaseListings = async () => {
  const vendors = await VendorModel.find({ farmName: { $exists: true, $nin: [null, ""] } }).select("_id");
  if (!vendors.length) return;

  const products = await ProductModel.find({});
  const templates = [];
  const seenSlugs = new Set();
  for (const product of products) {
    if (TEST_PRODUCT_NAME_PATTERN.test(product.productName) || seenSlugs.has(product.productSlug)) continue;
    seenSlugs.add(product.productSlug);
    templates.push(product);
  }
  if (!templates.length) return;

  const slugsByVendor = new Map();
  for (const product of products) {
    const vendorId = product.vendor.toString();
    const slugs = slugsByVendor.get(vendorId) || new Set();
    slugs.add(product.productSlug);
    slugsByVendor.set(vendorId, slugs);
  }

  let created = 0;

  for (const vendor of vendors) {
    const owned = slugsByVendor.get(vendor._id.toString()) || new Set();
    const needed = MIN_LISTINGS_PER_FARM - owned.size;
    if (needed <= 0) continue;

    const picks = templates
      .filter((t) => !owned.has(t.productSlug))
      .sort(() => Math.random() - 0.5)
      .slice(0, needed);

    for (const template of picks) {
      await cloneListingForVendor(template, vendor._id);
      created += 1;
    }
  }

  if (created > 0) {
    console.log(`Marketplace seed: created ${created} showcase listing(s) so every farm has products to sell.`);
  }
};

const seedMarketplace = async () => {
  try {
    await dropStaleProductNameUniqueIndex();
    await backfillProductFields();
    await relinkOrphanedProducts();
    await seedMockVendorAccounts();
    await seedVendorFarmProfiles();
    await seedFarmImages();
    await seedCrossVendorListings();
    await seedFarmShowcaseListings();
    await seedVendorReviews();
  } catch (e) {
    console.error("Marketplace seed/migration error:", e.message);
  }
};

module.exports = { seedMarketplace };
