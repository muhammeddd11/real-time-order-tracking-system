const Menu = require("../models/menuModel");
exports.getMenus = async (req, res) => {
  const menu = await Menu.find({});
  if (!menu) {
    return res.send("There is no menus to show");
  }
  res.status(200).json({
    status: "success",
    message: "The menu has been retrieved successfuly",
    menu,
  });
};
