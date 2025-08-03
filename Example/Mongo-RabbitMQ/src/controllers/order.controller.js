/** @format */

const mongoose = require("mongoose");
const createError = require("http-errors");
const Order = require("../../src/models/order.model");
const mqProducer = require("../rabbitMQ/producers/mqProducer");
const { MAPS } = require("../rabbitMQ/mqConfigs");

class OrderSchema {
  constructor() {}

  async createOrder(req, res, next) {
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const productsPrice = req.body.products.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);
      const newOrder = Order({
        _id: new mongoose.Types.ObjectId(),
        price: productsPrice,
        products: req.body.products,
      });
      const order = await newOrder.save();

      // RabbitMQ
      /**
       * Consumed by Product Consumer
       */
      await mqProducer(MAPS.PRODUCT.ROUTING_KEY, MAPS.PRODUCT.EXCHANGE_NAME, {
        products: req.body.products,
      });

      const paymentData = {
        amount: productsPrice,
        type: "success",
        payment_method: "UPI",
      };
      /**
       * Consumed by Payment Consumer
       */
      await mqProducer(
        MAPS.PAYMENT.ROUTING_KEY,
        MAPS.PAYMENT.EXCHANGE_NAME,
        paymentData
      );

      /**
       * Send Notification to Fanout Exchange
       */
      await mqProducer(MAPS.APP.ROUTING_KEY, MAPS.APP.EXCHANGE_NAME, {
        title: "Order successfully placed",
        type: "success",
      });

      await session.commitTransaction();
      session.endSession();
      return res
        .status(201)
        .json({ message: "A new order created", status: 201, order });
    } catch (error) {
      session.endSession();
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new OrderSchema();
