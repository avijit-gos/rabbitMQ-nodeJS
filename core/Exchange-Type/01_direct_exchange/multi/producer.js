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

async function producer(MESSAGE_KEY, data) {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHANGE_TYPE,
      { durable: false }
    );

    // assert queue
    await channel.assertQueue(MQ_CONFIGS.QUEUES.ORDER_QUEUE, {
      durable: false,
    });
    await channel.assertQueue(MQ_CONFIGS.QUEUES.PAYMENT_QUEUE, {
      durable: false,
    });

    // binding queue with exchange
    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.ORDER_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.KEYES.ORDER_KEY
    );
    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.PAYMENT_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.KEYES.PAYMENT_KEY
    );

    channel.publish(
      MQ_CONFIGS.EXCHANGE_NAME,
      MESSAGE_KEY,
      Buffer.from(JSON.stringify(data))
    );
    console.log("Message successfully published...");

    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}
producer("order-key", {
  id: 1,
  type: "payment",
  message: "Order placed successfully",
});
producer("payment-key", {
  id: 1,
  type: "payment",
  message: "Payment successfully",
});
