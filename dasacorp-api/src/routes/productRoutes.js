const express = require("express");
const {
  addProduct,
  listProducts,
  associateProductToCategory,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

router.post("/products", addProduct);
router.get("/products", listProducts);
router.post("/products/associate", associateProductToCategory);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get('/products/:id', getProductById); 

module.exports = router;
