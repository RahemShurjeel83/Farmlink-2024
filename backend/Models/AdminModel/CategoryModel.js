const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String,
    required: true,
  }
});

const CategoryModel = mongoose.model(
  "Category",
  categorySchema
);

module.exports = CategoryModel;
