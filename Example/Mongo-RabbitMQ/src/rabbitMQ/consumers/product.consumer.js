/** @format */

require("dotenv").config({ path: "../../../.env" });
require("../../config/mongo.setup");
const mqConnection = require("../mqConnection");
const mongoose = require("mongoose");
const Product = require("../../models/product.model");
const { MAPS } = require("../mqConfigs");

async function productConsumer() {
  try {
    const { channel } = await mqConnection();
    const { EXCHANGE_NAME, EXCHANGE_TYPE, QUEUE_NAME, ROUTING_KEY } =
      MAPS.PRODUCT;

    const DLX_QUEUE = `dlx-${QUEUE_NAME}`;
    const DLX_EXCHANGE = `_dlx_${EXCHANGE_NAME}`;
    const DLX_ROUTING_KEY = `${ROUTING_KEY}.dlx`;

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": DLX_EXCHANGE,
        "x-dead-letter-routing-key": DLX_ROUTING_KEY,
      },
    });
    channel.prefetch(1);

    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

    channel.consume(QUEUE_NAME, async (message) => {
      try {
        if (message) {
          const { products } = JSON.parse(message.content);
          const operation = products.map((product) => ({
            updateOne: {
              filter: { _id: product.product },
              update: { $inc: { units: -product.quantity } },
            },
          }));
          await Product.bulkWrite(operation);
          console.log("# Product operations done");
          channel.ack(message);
        }
      } catch (error) {
        channel.nack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
productConsumer();
