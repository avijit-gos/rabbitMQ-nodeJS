/** @format */

const amqp = require("amqplib");
const { CONNECTION_URL } = require("./mqConfigs");

let channel = null;
let connection = null;

async function mqConnection() {
  try {
    if (connection && channel) return { connection, channel };
    connection = await amqp.connect(CONNECTION_URL);
    channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.log(error);
  }
}
module.exports = mqConnection;
