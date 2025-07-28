/** @format */

const amqp = require("amqplib");
const MQ_CONFIGS = {
  CONNECTION_URL: "amqp://localhost",
  EXCHANGE_NAME: "topic-ecom-exchange",
  EXCHAGE_TYPE: "topic",
  QUEUES: {
    ORDER_QUEUE: "order-queue",
    PAYMENT_QUEUE: "payment-queue",
    NOTIFICATION_QUEUE: "notification-queue",
  },
  ROUTING_KEY: {
    ORDER_ROUTING_KEY: "order.*",
    PAYMENT_ROUTING_KEY: "*.payment.#",
    NOTIFICATION_ROUTING_KEY: "notification.#",
  },
};

async function notificationConsumer() {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHAGE_TYPE,
      { durable: false }
    );
    await channel.assertQueue(MQ_CONFIGS.QUEUES.NOTIFICATION_QUEUE, {
      durable: false,
    });

    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.NOTIFICATION_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.ROUTING_KEY.NOTIFICATION_ROUTING_KEY
    );

    channel.consume(MQ_CONFIGS.QUEUES.NOTIFICATION_QUEUE, (message) => {
      if (message) {
        console.log("Notification message consumed...");
        console.log(JSON.parse(message.content));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log("erorr");
  }
}
notificationConsumer();
