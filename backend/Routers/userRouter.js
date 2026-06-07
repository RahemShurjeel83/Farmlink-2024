const express = require("express");
const { Login, Register } = require("../Controllers/userController");
const { checkToken: Auth } = require("../middlewares/authentication");
const { postCategory, getCategories, updateCategory, deleteCategory } = require("../Controllers/Admin/CategoryController");
const { postproduct, getproduct, updateproduct, deleteproduct } = require("../Controllers/Admin/ProductController");
const { postcontactus, getcontactus, deletecontactus } = require("../Controllers/Admin/ContactUsController");
const {
  postorder,
  getorder,
  deleteorder,
  getCartItems,
  removeFromCart,
  filterbycategory,
  addtocartByUser,
} = require("../Controllers/Admin/OrderController");
const {
  categoryUploadMiddleware,
  productUploadMiddleware,
  categoryUpdateUploadMiddleware,
  productUpdateUploadMiddleware,
} = require("../middlewares/ImageMiddleware");
const { BothAuth } = require("../utils/guards");
const { getRecommendations, getTrending } = require("../Controllers/Admin/RecommendationsController");
const { getProductBySlug, getVendorProfile } = require("../Controllers/Admin/MarketplaceController");
const { getVendorReviews, postVendorReview } = require("../Controllers/Admin/ReviewController");

const router = express.Router();

// Auth
router.route("/login").post(Login);
router.route("/register").post(Register);

// Category Routes
router.route("/postcategory").post(Auth, BothAuth, categoryUploadMiddleware, postCategory);
router.route("/getcategory").get(getCategories);
router.route("/editcategory/:categoryId").put(Auth, BothAuth, categoryUpdateUploadMiddleware, updateCategory);
router.route("/deletecategory/:categoryId").delete(Auth, BothAuth, deleteCategory);

// Product Routes
router.route("/postproduct").post(Auth, BothAuth, productUploadMiddleware, postproduct);
router.route("/getproduct").get(getproduct);
router.route("/editproduct/:productId").put(Auth, BothAuth, productUpdateUploadMiddleware, updateproduct);
router.route("/deleteproduct/:productId").delete(Auth, BothAuth, deleteproduct);
router.route("/filterbycategory/:filter").get(filterbycategory);

// Contact Routes (public submission, auth required for reading/deleting)
router.route("/postcontactus").post(postcontactus);
router.route("/getcontactus").get(Auth, BothAuth, getcontactus);
router.route("/deletecontactus/:queryId").delete(Auth, BothAuth, deletecontactus);

// Order Routes
router.route("/postorder").post(Auth, postorder);
router.route("/getorder").get(Auth, BothAuth, getorder);
router.route("/deleteorder/:orderId").delete(Auth, BothAuth, deleteorder);

// Cart Routes
router.route("/addtocart/:productid").post(Auth, addtocartByUser);
router.route("/getCartItems").get(Auth, getCartItems);
router.route("/removeFromCart/:productid").delete(Auth, removeFromCart);

// AI Recommendation Routes (public)
router.route("/recommendations/:productId").get(getRecommendations);
router.route("/trending").get(getTrending);

// Marketplace Routes (public browsing; review submission requires login)
router.route("/product/:slug").get(getProductBySlug);
router.route("/farm/:vendorId").get(getVendorProfile);
router.route("/farm/:vendorId/reviews").get(getVendorReviews);
router.route("/farm/:vendorId/reviews").post(Auth, postVendorReview);

module.exports = router;
