/** @format */

const amqp = require("amqplib");

const MQ_CONFIGS = {
  CONNECTION: "amqp://localhost",
  EXCHANGE_NAME: "ecom-exchange",
  EXCHANGE_TYPE: "direct",
  QUEUES: {
    ORDER_QUEUE: "order-queue",
    PAYMENT_QUEUE: "payment-queue",
  },
  KEYES: {
    ORDER_KEY: "order-key",
    PAYMENT_KEY: "payment-key",
  },
};

async function paymentConsumer() {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHANGE_TYPE,
      { durable: false }
    );
    await channel.assertQueue(MQ_CONFIGS.QUEUES.PAYMENT_QUEUE, {
      durable: false,
    });

    await channel.prefetch(1);

    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.PAYMENT_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.KEYES.PAYMENT_KEY
    );

    channel.consume(MQ_CONFIGS.QUEUES.PAYMENT_QUEUE, (message) => {
      if (message) {
        console.log("Payment message received: ");
        console.log(JSON.parse(message.content));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
paymentConsumer();
