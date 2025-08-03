/** @format */

const amqp = require("amqplib");
const mqConnection = require("../mqConnection");

async function mqProducer(MESSAGE_ROUTING_KEY, EXCHANGE_NAME, DATA) {
  try {
    const { channel } = await mqConnection();

    channel.publish(
      EXCHANGE_NAME,
      MESSAGE_ROUTING_KEY,
      Buffer.from(JSON.stringify(DATA))
    );
    console.log("Message successfully published");
  } catch (error) {
    console.log(error);
  }
}

module.exports = mqProducer;
