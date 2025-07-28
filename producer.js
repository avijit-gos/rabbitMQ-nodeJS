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

async function producer(MESSAGE_ROUTING_KEY, data) {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION_URL);
    const channel = await connection.createChannel();

    // declare DLX exchange
    await channel.assertExchange(
      MQ_CONFIGS.DLX_EXCHANGES,
      MQ_CONFIGS.DLX_EXCHANGE_TYPE,
      { durable: true }
    );
    // declare DLX queue
    await channel.assertQueue(MQ_CONFIGS.DLX__QUEUES.DLX_USER_QUEUE, {
      durable: true,
    });
    // bind both DLX exchange and queue
    await channel.bindQueue(
      MQ_CONFIGS.DLX__QUEUES.DLX_USER_QUEUE,
      MQ_CONFIGS.DLX_EXCHANGES,
      MQ_CONFIGS.DLX_ROUTING_KEY.DLX_USER_ROUTING_KEY
    );

    // declare DIRECT exchange
    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHANGE_TYPE,
      { durable: true }
    );
    // declare DIRECT queue
    await channel.assertQueue(MQ_CONFIGS.QUEUES.USER_QUEUE, {
      durable: true,
      deadLetterExchange: MQ_CONFIGS.DLX_EXCHANGES,
      deadLetterRoutingKey: MQ_CONFIGS.DLX_ROUTING_KEY.DLX_USER_ROUTING_KEY,
    });

    // bind both DIRECT exchange and queue
    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.USER_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.ROUTING_KEY.USER_ROUTING_KEY
    );

    channel.publish(
      MQ_CONFIGS.EXCHANGE_NAME,
      MESSAGE_ROUTING_KEY,
      Buffer.from(JSON.stringify(data))
    );
    setTimeout(async () => {
      await channel.close();
      await connection.close();
      console.log("Message successfully pulished & connection closed");
    }, 500);
  } catch (error) {
    console.log(error);
  }
}
producer("user-routing-key", { id: 1, type: "User", message: "Hello user" });
