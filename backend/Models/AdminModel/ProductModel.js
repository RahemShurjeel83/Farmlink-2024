const mongoose = require("mongoose");
const { slugify } = require("../../utils/slugify");

const productSchema = mongoose.Schema({
    categoryName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productSlug: {
    type: String,
    index: true,
  },
  description:{
    type: String,
    required:true
  },
  newPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  oldPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

productSchema.pre("validate", function (next) {
  if (this.productName) {
    this.productSlug = slugify(this.productName);
  }
  next();
});

const ProductModel = mongoose.model(
  "Products",
  productSchema
);

module.exports = ProductModel;
