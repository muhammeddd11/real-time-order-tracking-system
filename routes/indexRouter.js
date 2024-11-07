const express = require("express");
const indexController = require("../controllers/indexController");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.route("/").get(indexController.homePage);
router.route("/updateCart").post(cartController.updateCart);
module.exports = router;
