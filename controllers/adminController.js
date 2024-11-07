const Order = require("../models/orderModel");
const Menu = require("../models/menuModel");
const { all } = require("../routes/userRouter");

exports.getAllOrder = async (req, res) => {
  const allOrder = await Order.find({ status: { $ne: "completed" } }, null, {
    sort: { createdAt: -1 },
  }).populate("userId", "-password");
  res.status(200).json({
    status: "success",
    message: `you have ${allOrder.length} uncompleted`,
    allOrder,
  });
};
exports.addNewProduct = async (req, res) => {
  const { name, price, image, size } = req.body;
  if (!name || !price || !image || !size) {
    req.flash("please provide a suitable data");
    return res.redirect("/admin/createProduct");
  }
  const isExist = await Menu.exists({ name });
  if (isExist) return res.send("The product is already here");
  const newProduct = await Menu.create({
    name,
    price,
    size,
    image,
  });
  res.status(200).json({
    status: "seccess",
    message: "A new product has been created",
    newProduct,
  });
};
exports.orderStatus = (req, res) => {};
