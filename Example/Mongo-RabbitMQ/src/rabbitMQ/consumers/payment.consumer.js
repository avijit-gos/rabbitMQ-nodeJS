/** @format */

require("dotenv").config({ path: "../../../.env" });
require("../../config/mongo.setup");
const mqConnection = require("../mqConnection");
const mongoose = require("mongoose");
const Payment = require("../../models/payment.model");
const { MAPS } = require("../mqConfigs");

async function paymentConsumer() {
  try {
    const { channel } = await mqConnection();
    const { EXCHANGE_NAME, EXCHANGE_TYPE, QUEUE_NAME, ROUTING_KEY } =
      MAPS.PAYMENT;

    const DLX_QUEUE = `dlx-${QUEUE_NAME}`;
    const DLX_EXCHANGE = `_dlx_${EXCHANGE_NAME}`;
    const DLX_ROUTING_KEY = `${ROUTING_KEY}.dlx`;

    // assert Exchange
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

    // assert Queue
    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": DLX_EXCHANGE,
        "x-dead-letter-routing-key": DLX_ROUTING_KEY,
      },
    });

    channel.prefetch(1);

    // bind Exchange with Queue
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

    channel.consume(QUEUE_NAME, async (message) => {
      try {
        if (message) {
          const data = JSON.parse(message.content);
          const newPayment = Payment({
            _id: new mongoose.Types.ObjectId(),
            type: data.type,
            amount: data.amount,
            payment_method: data.payment_method,
          });
          const result = await newPayment.save();
          console.log("Payment data saved");
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

paymentConsumer();
