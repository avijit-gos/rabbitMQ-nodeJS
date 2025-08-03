/** @format */

const mongoose = require("mongoose");
const Product = require("../models/product.model");
const createError = require("http-errors");

class ProductController {
  constructor() {}

  async createProduct(req, res, next) {
    try {
      const newProduct = Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        units: req.body.units,
      });
      const product = await newProduct.save();
      return res
        .status(201)
        .json({ message: "A product has been created", status: 201, product });
    } catch (error) {
      createError.BadRequest(error.message);
    }
  }
}

module.exports = new ProductController();
