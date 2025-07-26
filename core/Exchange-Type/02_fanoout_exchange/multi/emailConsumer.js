/** @format */

const amqp = require("amqplib");

const MQ_CONFIG = {
  CONNECTION_URL: "amqp://localhost",
  EXCHANGE_NAME: "notification-exchange",
  EXCHANGE_TYPE: "fanout",
  QUEUES: {
    SMS_QUEUE: "sms-queue",
    EMAIL_QUEUE: "email-queue",
  },
  ROUTING_KEY: "",
};

async function emailConsumer() {
  try {
    const connection = await amqp.connect(MQ_CONFIG.CONNECTION_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIG.EXCHANGE_NAME,
      MQ_CONFIG.EXCHANGE_TYPE,
      { durable: false }
    );
    await channel.assertQueue(MQ_CONFIG.QUEUES.EMAIL_QUEUE, { durable: false });

    await channel.bindQueue(
      MQ_CONFIG.QUEUES.EMAIL_QUEUE,
      MQ_CONFIG.EXCHANGE_NAME,
      MQ_CONFIG.ROUTING_KEY
    );

    await channel.prefetch(1);

    channel.consume(MQ_CONFIG.QUEUES.EMAIL_QUEUE, (message) => {
      if (message) {
        console.log("A new message consumed");
        console.log(JSON.parse(message.content));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
emailConsumer();
