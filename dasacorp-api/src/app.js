const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares");
const logger = require("./config/logger");

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(errorHandler);

module.exports = app;
