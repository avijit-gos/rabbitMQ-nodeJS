/** @format */

const amqp = require("amqplib");

const MQ_CONFIGS = {
  CONNECTION_URL: "amqp://localhost",
  EXCHANGE_NAME: "ecom-exchange",
  EXCHANGE_TYPE: "topic",
  QUEUES: {
    ORDER_QUEUE: "order",
  },
  ROUTING_KEYES: {
    ORDER_KEY: "order.*",
  },
};

async function consmer() {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHANGE_TYPE,
      { durable: false }
    );
    await channel.assertQueue(MQ_CONFIGS.QUEUES.ORDER_QUEUE, {
      durable: false,
    });

    channel.prefetch(1);

    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.ORDER_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.ROUTING_KEYES.ORDER_KEY
    );

    channel.consume(MQ_CONFIGS.QUEUES.ORDER_QUEUE, (message) => {
      if (message) {
        console.log("Order data received");
        console.log(JSON.parse(message.content));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
consmer();
