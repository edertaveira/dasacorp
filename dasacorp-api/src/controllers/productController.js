const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { cache } = require("../config/cache");
const ProductCatalog = require("../models/productCatalogModel");
const { publishToQueue } = require("../config/rabbitmq");

const updateProductCatalog = async (productId) => {
  const product = await Product.findOne({
    where: { id: productId },
    include: Category,
  });
  if (product) {
    console.log("###", {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      ownerId: product.ownerId,
      categoryId: product.categoryId,
      categoryTitle: product.Category ? product.Category.title : null,
      categoryDescription: product.Category
        ? product.Category.description
        : null,
    });
    await ProductCatalog.upsert({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      ownerId: product.ownerId,
      categoryId: product.categoryId,
      categoryTitle: product.Category ? product.Category.title : null,
      categoryDescription: product.Category
        ? product.Category.description
        : null,
    });
    await publishToQueue(
      "catalog-emit",
      JSON.stringify({
        action: "update",
        product: {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          ownerId: product.ownerId,
          categoryId: product.categoryId,
          categoryTitle: product.Category ? product.Category.title : null,
          categoryDescription: product.Category
            ? product.Category.description
            : null,
        },
      })
    );
  }
};

const deleteFromProductCatalog = async (productId) => {
  await ProductCatalog.destroy({ where: { id: productId } });
  await publishToQueue(
    "catalog-emit",
    JSON.stringify({
      action: "delete",
      productId,
    })
  );
};

const addProduct = async (req, res) => {
  const { title, description, price, ownerId, categoryId } = req.body;

  if (!title || !description || !price || !ownerId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = await Product.create({
      title,
      description,
      price,
      ownerId,
      categoryId,
    });
    await updateProductCatalog(product.id);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

const listProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const cacheKey = `products_${page}_${limit}`;

  try {
    const cacheMemory = await cache;
    const cachedResult = await cacheMemory.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }
    const { count, rows } = await ProductCatalog.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const result = {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      products: rows,
    };

    await cacheMemory.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

const associateProductToCategory = async (req, res) => {
  const { productId, categoryId } = req.body;

  if (!productId || !categoryId) {
    return res
      .status(400)
      .json({ message: "Product ID and Category ID are required" });
  }

  try {
    const product = await Product.findOne({ where: { id: productId } });
    const category = await Category.findOne({ where: { id: categoryId } });

    if (!product || !category) {
      return res.status(404).json({ message: "Product or Category not found" });
    }

    if (product.ownerId !== category.ownerId) {
      return res.status(400).json({
        message: "Product and Category must belong to the same owner",
      });
    }

    product.categoryId = categoryId;
    await product.save();
    await updateProductCatalog(product.id);
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error associating product to category", error });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, categoryId, ownerId } = req.body;

  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.ownerId !== ownerId) {
      return res.status(400).json({
        message: "Unauthorized update: Product must belong to the same owner",
      });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.categoryId = categoryId || product.categoryId;

    await product.save();
    await updateProductCatalog(product.id);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { ownerId } = req.body;

  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.ownerId !== ownerId) {
      return res.status(400).json({
        message: "Unauthorized delete: Product must belong to the same owner",
      });
    }

    await product.destroy();
    await deleteFromProductCatalog(product.id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

const search = async (rec, res) => {
  const { productTitle, categoryTitle } = req.query;
  const cacheKey = `search:${productTitle}:${categoryTitle}`;
  try {
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const products = await ProductCatalog.findAll({
      where: {
        title: productTitle,
        categoryTitle: categoryTitle,
      },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }

    await cache.set(cacheKey, JSON.stringify(products));
    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

module.exports = {
  addProduct,
  listProducts,
  associateProductToCategory,
  updateProduct,
  deleteProduct,
  search,
  getProductById,
};
