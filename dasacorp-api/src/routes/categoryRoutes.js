const express = require("express");
const {
  addCategory,
  listCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/categories", addCategory);
router.get("/categories", listCategories);
router.put("/categories/:id", updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/categories/:id', getCategoryById); 

module.exports = router;
