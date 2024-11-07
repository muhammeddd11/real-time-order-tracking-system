const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictedTo("admin"));
router.route("/orders").get(adminController.getAllOrder);
router.route("/createProduct").post(adminController.addNewProduct);
router.route("/order/status").get(adminController.orderStatus);

module.exports = router;
