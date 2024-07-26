// tests/category.test.js
require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/database");
const Category = require("../src/models/categoryModel");
const Product = require("../src/models/productModel");

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
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

describe("Category API", () => {
  it("should create a new category", async () => {
    const response = await request(app).post("/api/categories").send({
      title: "Categoria Teste",
      description: "Descrição da categoria teste",
      ownerId: 1,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Categoria Teste");
  });

  it("should list all categories", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(response.body[0].title).toBe("Categoria Teste");
  });

  it("should update a category", async () => {
    const response = await request(app).put("/api/categories/1").send({
      title: "Categoria Atualizada",
      description: "Descrição da categoria atualizada",
      ownerId: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Categoria Atualizada");
    expect(response.body.description).toBe("Descrição da categoria atualizada");
  });

  it("should delete a category", async () => {
    // Primeiro, remova a associação do produto à categoria
    await request(app).put("/api/products/1").send({
      title: "Produto Teste",
      description: "Descrição do produto teste",
      price: 100.0,
      categoryId: null, // Remove a associação à categoria
      ownerId: 1,
    });

    const response = await request(app).delete("/api/categories/1").send({
      ownerId: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Category deleted successfully");
  });

  it("should not delete a category with associated products", async () => {
    await Category.create({
      title: "Categoria com Produtos",
      description: "Categoria com produtos associados",
      ownerId: 1,
    });
    await Product.create({
      title: "Produto Associado",
      description: "Produto associado à categoria",
      price: 50.0,
      ownerId: 1,
      categoryId: 2,
    });

    const response = await request(app).delete("/api/categories/2").send({
      ownerId: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Cannot delete category with associated products"
    );
  });
});
