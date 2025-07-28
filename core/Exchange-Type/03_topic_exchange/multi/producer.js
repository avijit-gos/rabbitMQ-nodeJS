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

async function producer(MESSAGE_ROUTING_KEY, data) {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHAGE_TYPE,
      { durable: false }
    );

    channel.publish(
      MQ_CONFIGS.EXCHANGE_NAME,
      MESSAGE_ROUTING_KEY,
      Buffer.from(JSON.stringify(data))
    );
    console.log("Message successfully published");

    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

// producer("payment.success", {
//   id: 1,
//   type: "order",
//   message: "Order payment successfull",
// });

producer("notification", {
  id: 1,
  type: "notification",
  message: "Order noffication successfull",
});
