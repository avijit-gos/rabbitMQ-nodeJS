/** @format */

const amqp = require("amqplib");

const MQ_CONFIGS = {
  EXCHANGE_CONNECTION: "amqp://localhost",
  EXCHANGE_NAME: "my-exchange",
  EXCHANGE_TYPE: "direct",
  QUEUES: {
    ORDER_QUEUE: "order-queue",
  },
  ROUTING_KEYES: {
    ORDER_ROUTING_KEY: "order-key",
  },
};

async function producer(MESSAGE_KEY, data) {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.EXCHANGE_CONNECTION);
    const channel = await connection.createChannel();

    // assert Exchnage
    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHANGE_TYPE,
      { durable: false }
    );
    // assert Queue
    await channel.assertQueue(MQ_CONFIGS.QUEUES.ORDER_QUEUE, {
      durable: false,
    });

    // bind Exchange with Queue
    await channel.bindQueue(
      MQ_CONFIGS.QUEUES.ORDER_QUEUE,
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.ROUTING_KEYES.ORDER_ROUTING_KEY
    );

    channel.publish(
      MQ_CONFIGS.EXCHANGE_NAME,
      MESSAGE_KEY,
      Buffer.from(JSON.stringify(data))
    );
    console.log("Message successfully send...");

    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);
  } catch (error) {
    console.log("Error:", error);
  }
}
producer("order-key", {
  id: 1,
  type: "success",
  message: "Order successfully placed",
});
