const AsyncHandler = require("express-async-handler");
const ProductModel = require("../../Models/AdminModel/ProductModel");
const CategoryModel = require("../../Models/AdminModel/CategoryModel");
const config = require("../../config");
const mongoose = require("mongoose");
const VendorModel = require("../../Models/vendorModel");

const postproduct = AsyncHandler(async (req, res) => {
  const { categoryName, productName, description, newPrice, oldPrice, quantity } = req.body;
  const { userId } = req;

  if (!categoryName || !productName || !description || !newPrice || !oldPrice || !quantity) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const existingCategory = await CategoryModel.findOne({ categoryName });
  if (!existingCategory) {
    return res.status(404).json({ success: false, message: "Category not found." });
  }

  const existingProduct = await ProductModel.findOne({ productName, categoryName, vendor: userId });
  if (existingProduct) {
    return res.status(400).json({ success: false, message: "You already have a product with this name in this category." });
  }

  const productImage = config.baseImageUrl + req.file.filename;

  const newProduct = await ProductModel.create({
    categoryName,
    productName,
    description,
    newPrice,
    oldPrice,
    quantity,
    productImage,
    vendor: userId,
    category: existingCategory._id,
  });

  await VendorModel.findByIdAndUpdate(
    userId,
    { $addToSet: { products: newProduct._id } }
  );

  res.status(201).json({ success: true, message: "Product added successfully." });
});

const updateproduct = AsyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { userId, role } = req;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  const product = await ProductModel.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  // Vendors can only edit their own listings; admins can edit any
  if (role !== "admin" && product.vendor.toString() !== userId) {
    return res.status(403).json({ success: false, message: "You are not authorized to edit this product." });
  }

  const { categoryName, productName, description, newPrice, oldPrice, quantity } = req.body;

  if (categoryName) {
    const existingCategory = await CategoryModel.findOne({ categoryName });
    if (!existingCategory) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    product.categoryName = categoryName;
    product.category = existingCategory._id;
  }

  if (productName) product.productName = productName;
  if (description) product.description = description;
  if (newPrice !== undefined) product.newPrice = newPrice;
  if (oldPrice !== undefined) product.oldPrice = oldPrice;
  if (quantity !== undefined) product.quantity = quantity;
  if (req.file) product.productImage = config.baseImageUrl + req.file.filename;

  await product.save();

  res.status(200).json({ success: true, message: "Product updated successfully.", data: product });
});

const getproduct = AsyncHandler(async (req, res) => {
  const products = await ProductModel.find({});
  res.status(200).json({ success: true, data: products });
});

const getproductForVendor = AsyncHandler(async (req, res) => {
  const products = await ProductModel.find({ vendor: req.userId });
  res.status(200).json({ success: true, data: products });
});

const deleteproduct = AsyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { userId, role } = req;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  const product = await ProductModel.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  // Vendors can only delete their own products; admins can delete any
  if (role !== "admin" && product.vendor.toString() !== userId) {
    return res.status(403).json({ success: false, message: "You are not authorized to delete this product." });
  }

  await ProductModel.findByIdAndDelete(productId);
  await VendorModel.findByIdAndUpdate(
    product.vendor,
    { $pull: { products: new mongoose.Types.ObjectId(productId) } }
  );

  res.status(200).json({ success: true, message: "Product deleted successfully." });
});

module.exports = { postproduct, getproduct, updateproduct, deleteproduct, getproductForVendor };
