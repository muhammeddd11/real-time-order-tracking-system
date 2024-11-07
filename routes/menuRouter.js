const express = require("express");
const menuController = require("../controllers/menuController.js");
const router = express.Router();
router.route("/").get(menuController.getMenus);
module.exports = router;
