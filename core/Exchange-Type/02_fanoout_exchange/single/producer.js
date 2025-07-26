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

async function producer(MESSAGE_KEY, data) {
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

    channel.publish(
      MQ_CONFIG.EXCHANGE_NAME,
      MESSAGE_KEY,
      Buffer.from(JSON.stringify(data))
    );
    console.log("Message  successfully published");

    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 300);
  } catch (error) {
    console.log(error);
  }
}
producer("", {
  id: 1,
  type: "Notification",
  message: "A new notification received",
});
