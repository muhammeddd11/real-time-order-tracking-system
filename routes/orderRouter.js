const express = require("express");
const Order = require("../controllers/orderController");
const authController = require("../controllers/authController");
const router = express.Router();
router.route("/createOrder").get(authController.protect, Order.createOrder);
module.exports = router;
