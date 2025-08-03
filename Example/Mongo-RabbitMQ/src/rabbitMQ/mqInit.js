/** @format */

const amqp = require("amqplib");
const mqConnection = require("./mqConnection");
const { MAPS } = require("./mqConfigs");

async function mqInit() {
  try {
    const { channel } = await mqConnection();

    for (let key in MAPS) {
      const { EXCHANGE_NAME, EXCHANGE_TYPE, QUEUE_NAME, ROUTING_KEY } =
        MAPS[key];
      const DLX_QUEUE = `dlx-${QUEUE_NAME}`;
      const DLX_EXCHANGE = `_dlx_${EXCHANGE_NAME}`;
      const DLX_ROUTING_KEY = `${ROUTING_KEY}.dlx`;

      // assert Main Exchange
      await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
        durable: true,
      });
      // assert DLX Echange
      await channel.assertExchange(DLX_EXCHANGE, EXCHANGE_TYPE, {
        durable: true,
      });

      // assert Main Queue
      await channel.assertQueue(QUEUE_NAME, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": DLX_EXCHANGE,
          "x-dead-letter-routing-key": `${ROUTING_KEY}.dlx`,
        },
      });
      // assert DLX Queue
      await channel.assertQueue(DLX_QUEUE, { durable: true });

      // bind Main Exchange & Queue
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);
      // bind DLX Exchange & Queue
      await channel.bindQueue(DLX_QUEUE, DLX_EXCHANGE, DLX_ROUTING_KEY);

      console.log(`* ${QUEUE_NAME} bind with ${EXCHANGE_NAME}`);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = mqInit;
