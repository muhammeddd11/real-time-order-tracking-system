const Order = require("../models/orderModel");
exports.createOrder = (req, res) => {
  const { phone, address } = req.body;
  if (!phone || !address) {
    res.flash("All fields are required");
    return res.redirect("/cart");
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
    req.flash("Something went wrong please try again");
    return res.redirect("/cart");
  }
};
exports.getUserOrder = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }, null, {
    sort: { createdAt: -1 },
  });
  res.header("Cache-Control", "no-cahce");
  res.send(orders);
};
exports.getSingleOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (req.user._id === order.userId) {
    return res.send(order);
  } else {
    res.send("You are not authorized to see this order");
    return res.redirect("/");
  }
};
