const Order = require("../models/orderModel");
const Menu = require("../models/menuModel");
const AppError = require("../utls/AppError");
const catchAsync = require("../utls/catchAsync");
const { all } = require("../routes/userRouter");

exports.getAllOrder = catchAsync(async (req, res, next) => {
  const allOrder = await Order.find({ status: { $ne: "completed" } }, null, {
    sort: { createdAt: -1 },
  }).populate("userId", "-password");
  res.status(200).json({
    status: "success",
    message: `you have ${allOrder.length} uncompleted`,
    allOrder,
  });
});
exports.addNewProduct = catchAsync(async (req, res, next) => {
  const { name, price, image, size } = req.body;
  if (!name || !price || !image || !size) {
    return next(
      new AppError("Please provide suitable product information", 400)
    );
  }
  const isExist = await Menu.exists({ name });
  if (isExist)
    return next(
      new AppError("The product you're trying to add is already here", 400)
    );
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
});
exports.orderStatus = (req, res) => {};
