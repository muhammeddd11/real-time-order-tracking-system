exports.updateCart = (req, res) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }

  const { cart } = req.session;
  if (!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      item: req.body,
      qty: 1,
    };
    cart.totalQty += 1;
    cart.totalPrice += parseInt(req.body.price, 10);
  } else {
    cart.items[req.body._id].qty += 1;
    cart.totalPrice += parseInt(req.body.price, 10);
    cart.totalQty += 1;
  }
  return res.status(200).json({
    status: "success",
    message: "The cart has been updated ",
    totalQty: req.session.cart.totalQty,
  });
};
