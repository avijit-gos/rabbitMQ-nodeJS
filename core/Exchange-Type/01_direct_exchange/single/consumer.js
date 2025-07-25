/** @format */

const amqp = require("amqplib");

const MQ_CONFIGS = {
  CONNECTION: "amqp://localhost",
  EXCHANGE_NAME: "my-exchange",
  EXCHANGE_TYPE: "direct",
  QUEUES: {
    ORDER_QUEUE: "order-queue",
  },
  ROUTING_KEYES: {
    ORDER_ROUTING_KEY: "order-key",
  },
};

async function consumer() {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHANGE_TYPE,
      { durable: false }
    );
    await channel.assertQueue(MQ_CONFIGS.QUEUES.ORDER_QUEUE, {
      durable: false,
    });

    await channel.prefetch(1);

    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.ORDER_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.ROUTING_KEYES.ORDER_ROUTING_KEY
    );

    channel.consume(MQ_CONFIGS.QUEUES.ORDER_QUEUE, (message) => {
      if (message) {
        console.log("Message received:");
        console.log(JSON.parse(message.content));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
consumer();
