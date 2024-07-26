const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const addCategory = async (req, res) => {
  const { title, description, ownerId } = req.body;

  if (!title || !description || !ownerId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const category = await Category.create({ title, description, ownerId });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

const listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { title, description, ownerId } = req.body;

  try {
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.ownerId !== ownerId) {
      return res.status(400).json({
        message: "Unauthorized update: Category must belong to the same owner",
      });
    }

    category.title = title || category.title;
    category.description = description || category.description;

    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { ownerId } = req.body;

  try {
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.ownerId !== ownerId) {
      return res.status(400).json({
        message: "Unauthorized delete: Category must belong to the same owner",
      });
    }

    const products = await Product.findAll({ where: { categoryId: id } });

    if (products.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with associated products" });
    }

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving category", error });
  }
};

module.exports = {
  addCategory,
  listCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
