/** @format */
const router = require("express").Router();
const { createOrder } = require("../controllers/order.controller");

router.post("/", createOrder);

module.exports = router;
