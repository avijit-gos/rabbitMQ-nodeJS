/** @format */

const amqp = require("amqplib");
const MQ_CONFIGS = {
  CONNECTION_URL: "amqp://localhost",

  EXCHANGE_NAME: "test-1",
  DLX_EXCHANGES: "dlx-test-1",

  EXCHANGE_TYPE: "direct",
  DLX_EXCHANGE_TYPE: "direct",

  QUEUES: {
    USER_QUEUE: "user-queue",
  },
  DLX__QUEUES: {
    DLX_USER_QUEUE: "dlx-user-queue",
  },
  ROUTING_KEY: {
    USER_ROUTING_KEY: "user-routing-key",
  },
  DLX_ROUTING_KEY: {
    DLX_USER_ROUTING_KEY: "dlx-user-routing-key",
  },
};

async function consumer() {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHANGE_TYPE,
      { durable: true }
    );
    await channel.assertQueue(MQ_CONFIGS.QUEUES.USER_QUEUE, {
      durable: true,
      deadLetterExchange: MQ_CONFIGS.DLX_EXCHANGES,
      deadLetterRoutingKey: MQ_CONFIGS.DLX_ROUTING_KEY.DLX_USER_ROUTING_KEY,
    });

    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.USER_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.ROUTING_KEY.USER_ROUTING_KEY
    );

    channel.consume(MQ_CONFIGS.QUEUES.USER_QUEUE, (message) => {
      if (message) {
        console.log("Message consumed....");
        console.log(JSON.parse(message.content));
        // channel.ack(message);
        channel.nack(message, false, false);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
consumer();
