const AsyncHandler = require("express-async-handler");
const CategoryModel = require("../../Models/AdminModel/CategoryModel");
const config = require("../../config");

const postCategory = AsyncHandler(async (req, res) => {
  const { categoryName } = req.body;
  try {
    const existingCategory = await CategoryModel.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category already exists." });
    }

    const categoryImage = req.file.filename;
    await CategoryModel.create({
      categoryName,
      categoryImage: config.baseImageUrl + categoryImage,
    });

    res.status(201).json({ success: true, message: "Category added successfully." });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ success: false, message: "Error adding category." });
  }
});



const updateCategory = AsyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  const { categoryName } = req.body;

  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found." });
  }

  if (categoryName) {
    const existingCategory = await CategoryModel.findOne({ categoryName, _id: { $ne: categoryId } });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "A category with this name already exists." });
    }
    category.categoryName = categoryName;
  }
  if (req.file) category.categoryImage = config.baseImageUrl + req.file.filename;

  await category.save();

  res.status(200).json({ success: true, message: "Category updated successfully.", data: category });
});

const getCategories = AsyncHandler(async (req, res) => {
  const categories = await CategoryModel.find();
  res.status(200).json(categories);
});



const deleteCategory = AsyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const deletedCategory = await CategoryModel.findOneAndDelete({ _id: categoryId });
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


module.exports = { postCategory, getCategories, updateCategory, deleteCategory };
