const Order = require("../models/orderModel");
const AppError = require("../utls/AppError");
const catchAsync = require("../utls/catchAsync");
exports.createOrder = catchAsync((req, res, next) => {
  const { phone, address } = req.body;
  if (!phone || !address) {
    return next(new AppError("Please provide all related information", 400));
  }
  const order = Order.create({
    userId: req.session.user._id,
    items: req.session.cart,
    phone,
    address,
  });
  if (order) {
    Order.populate(order, { path: "userId" }, (err, placedOrder) => {
      const eventEmitter = req.app.get("eventEmitter");
      eventEmitter.emit("orderPlaced", order);
      delete req.session.cart;
      return res.status(200).json({
        status: "success",
        message: "Your order has been replaced",
        order,
      });
    });
  } else {
    return next(
      new AppError("Something went wrong please try again later", 501)
    );
  }
});
exports.getUserOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id }, null, {
    sort: { createdAt: -1 },
  });
  res.header("Cache-Control", "no-cahce");
  res.send(orders);
});
exports.getSingleOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (req.user._id === order.userId) {
    return res.send(order);
  } else {
    return next(new AppError("You are not authorized to see this order", 401));
  }
});
