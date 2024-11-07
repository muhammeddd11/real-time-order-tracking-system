const express = require("express");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.use(authController.protect);
router.route("/orders").get(orderController.getUserOrder);
router.route("/orders/:id").get(orderController.getSingleOrder);

module.exports = router;
