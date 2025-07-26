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

async function producer(MESSAGE_ROOUTING_KEY, data) {
  try {
    const connection = await amqp.connect(MQ_CONFIG.CONNECTION_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(
      MQ_CONFIG.EXCHANGE_NAME,
      MQ_CONFIG.EXCHANGE_TYPE,
      { durable: false }
    );
    await channel.assertQueue(MQ_CONFIG.QUEUES.SMS_QUEUE, { durable: false });
    await channel.assertQueue(MQ_CONFIG.QUEUES.EMAIL_QUEUE, { durable: false });

    await channel.bindQueue(
      MQ_CONFIG.QUEUES.SMS_QUEUE,
      MQ_CONFIG.EXCHANGE_NAME,
      MQ_CONFIG.ROUTING_KEY
    );
    await channel.bindQueue(
      MQ_CONFIG.QUEUES.EMAIL_QUEUE,
      MQ_CONFIG.EXCHANGE_NAME,
      MQ_CONFIG.ROUTING_KEY
    );

    channel.publish(
      MQ_CONFIG.EXCHANGE_NAME,
      MESSAGE_ROOUTING_KEY,
      Buffer.from(JSON.stringify(data))
    );

    setTimeout(async () => {
      console.log("Connection closed");
      await channel.close();
      await connection.close();
    }, 300);
  } catch (error) {
    console.log(error);
  }
}

producer("", {
  id: 2,
  type: "Notification",
  message: "A new notification received",
});
