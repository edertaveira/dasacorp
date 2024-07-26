require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/database");
const Category = require("../src/models/categoryModel");
const Product = require("../src/models/productModel");
const cache = require("../src/config/cache");
const ProductCatalog = require("../src/models/productCatalogModel");


beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
    await Category.create({
      title: "Categoria Teste",
      description: "Descrição da categoria teste",
      ownerId: 1,
    });
    await Product.create({
      title: "Produto Teste",
      description: "Descrição do produto teste",
      price: 100.0,
      ownerId: 1,
    });
    await ProductCatalog.create({
      title: "Produto Teste",
      description: "Descrição do produto teste",
      price: 100.0,
      ownerId: 1,
      categoryId: 1,
      categoryTitle: "Categoria Teste",
      categoryDescription: "Cattegory Description",
    });

    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error closing the database connection:", error);
  }
});

describe("Product API", () => {
  it("should create a new product with optional category", async () => {
    const response = await request(app).post("/api/products").send({
      title: "Produto Teste",
      description: "Descrição do produto teste",
      price: 100.0,
      ownerId: 1,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Produto Teste");
  });

  it("should list all products with their categories and pagination", async () => {
    const response = await request(app).get("/api/products?page=1&limit=1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("totalItems");
    expect(response.body).toHaveProperty("totalPages");
    expect(response.body).toHaveProperty("currentPage");
    expect(response.body).toHaveProperty("products");
    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].title).toBe("Produto Teste");
  });

  it("should associate a product to a category", async () => {
    const response = await request(app).post("/api/products/associate").send({
      productId: 1,
      categoryId: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.categoryId).toBe(1);
  });

  it("should not associate a product to a category of different owner", async () => {
    await Category.create({
      title: "Outra Categoria",
      description: "Descrição da outra categoria",
      ownerId: 2,
    });
    const response = await request(app).post("/api/products/associate").send({
      productId: 1,
      categoryId: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Product and Category must belong to the same owner"
    );
  });

  it("should update a product", async () => {
    const response = await request(app).put("/api/products/1").send({
      title: "Produto Atualizado",
      description: "Descrição do produto atualizado",
      price: 150.0,
      categoryId: 1,
      ownerId: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Produto Atualizado");
    expect(response.body.description).toBe("Descrição do produto atualizado");
    expect(response.body.price).toBe(150.0);
    expect(response.body.categoryId).toBe(1);
  });

  it("should not update a product with a different owner", async () => {
    const response = await request(app).put("/api/products/1").send({
      title: "Tentativa de Atualização",
      description: "Descrição da tentativa de atualização",
      price: 200.0,
      categoryId: 1,
      ownerId: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Unauthorized update: Product must belong to the same owner"
    );
  });

  it("should delete a product", async () => {
    const response = await request(app).delete("/api/products/1").send({
      ownerId: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted successfully");
  });

 
  
});
