/** @format */

const amqp = require("amqplib");

const MQ_CONFIG = {
  CONNECTION_URL: "amqp://localhost",
  EXCHANGE_NAME: "test-notification-1",
  EXCHANGE_TYPE: "fanout",
  QUEUES: {
    SMS_QUEUE: "sms-queue-1",
  },
  KEYES: {
    SMS_KEY: "",
  },
};

async function consumer() {
  try {
    const connection = await amqp.connect(MQ_CONFIG.CONNECTION_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIG.EXCHANGE_NAME,
      MQ_CONFIG.EXCHANGE_TYPE,
      { durable: false }
    );
    await channel.assertQueue(MQ_CONFIG.QUEUES.SMS_QUEUE, { durable: false });

    await channel.bindQueue(
      MQ_CONFIG.QUEUES.SMS_QUEUE,
      MQ_CONFIG.EXCHANGE_NAME,
      MQ_CONFIG.KEYES.SMS_KEY
    );

    channel.consume(MQ_CONFIG.QUEUES.SMS_QUEUE, (message) => {
      if (message) {
        console.log("A new message consumed...");
        console.log(JSON.parse(message.content));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
consumer();
