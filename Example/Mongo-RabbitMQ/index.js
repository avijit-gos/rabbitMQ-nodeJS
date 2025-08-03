/** @format */

require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const logger = require("morgan");
require("./src/config/mongo.setup");
const mqInit = require("./src/rabbitMQ/mqInit");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger("dev"));
app.use(cors());
app.use("/api/v1/products", require("./src/routes/product.routes"));
app.use("/api/v1/orders", require("./src/routes/order.routes"));

// If route not found
app.use(async (req, res, next) => {
  next(createError.NotFound("Page not found"));
});
// Error message
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 7070;

app.listen(port, async () => {
  await mqInit();
  console.log(`Server listening on ${port}`);
});
