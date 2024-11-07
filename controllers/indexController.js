const Menu = require("../models/menuModel");
exports.homePage = async (req, res) => {
  const menu = await Menu.find({});
  if (!menu) return res.send("No products to show");
  return res.status(200).json({
    status: "success",
    message: "All product have been retrieved",
    menu,
  });
};
