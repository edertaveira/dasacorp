const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductCatalog = sequelize.define(
  "ProductCatalog",
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    ownerId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    categoryTitle: DataTypes.STRING,
    categoryDescription: DataTypes.TEXT,
  },
  {}
);

module.exports = ProductCatalog;
