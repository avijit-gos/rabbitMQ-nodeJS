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

async function producer(MESSAGE_ROUTING_KEY, data) {
  try {
    const connection = await amqp.connect(MQ_CONFIGS.CONNECTION_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(
      MQ_CONFIGS.EXCHANGE_NAME,
      MQ_CONFIGS.EXCHANGE_TYPE,
      { durable: false }
    );

    channel.publish(
      MQ_CONFIGS.EXCHANGE_NAME,
      MESSAGE_ROUTING_KEY,
      Buffer.from(JSON.stringify(data))
    );
    console.log("Message published");
    setTimeout(async () => {
      await connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}
producer("order.success", {
  id: 1,
  type: "order",
  message: "Order successfully placed",
});
