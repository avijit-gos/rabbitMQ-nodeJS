/** @format */

module.exports = {
  CONNECTION_URL: "amqp://localhost",

  // // Exchange Names
  // DIRECT_EXCHANGE_NAME: "TEST-1",
  // FANOUT_EXCHANGE_NAME: "TEST-2",

  // // Message Routing Keys
  // PRODUCT_MESSAGE_KEY: "product",
  // PAYMENT_MESSAGE_KEY: "payment",

  // Queue + Exchange Map
  MAPS: {
    PRODUCT: {
      EXCHANGE_NAME: "TEST-1",
      EXCHANGE_TYPE: "direct",
      QUEUE_NAME: "product-queue",
      ROUTING_KEY: "product",
    },
    PAYMENT: {
      EXCHANGE_NAME: "TEST-1",
      EXCHANGE_TYPE: "direct",
      QUEUE_NAME: "payment-queue",
      ROUTING_KEY: "payment",
    },
    APP: {
      EXCHANGE_NAME: "TEST-2",
      EXCHANGE_TYPE: "fanout",
      QUEUE_NAME: "app-queue",
      ROUTING_KEY: "",
    },
    EMAIL: {
      EXCHANGE_NAME: "TEST-2",
      EXCHANGE_TYPE: "fanout",
      QUEUE_NAME: "email-queue",
      ROUTING_KEY: "",
    },
    SMS: {
      EXCHANGE_NAME: "TEST-2",
      EXCHANGE_TYPE: "fanout",
      QUEUE_NAME: "sms-queue",
      ROUTING_KEY: "",
    },
  },
};
