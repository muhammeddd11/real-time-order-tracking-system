const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.jwtSecret, {
    expiresIn: process.env.expiresIn,
  });
};
const sendToken = (user, status, res, message) => {
  const token = createToken(user._id);
  user.password = undefined; // to not send the passsword in the respone
  const cookieOPtions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("JWT", token, cookieOPtions);
  res.status(status).json({
    status: "success",
    message,
    token,
    user,
  });
};
exports.signUp = async function (req, res) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatarURL: req.body.avatarURL,
      avatarPublicId: req.body.avatarPublicId,
      role: req.body.role,
    });
    sendToken(newUser, 200, res, "Your account has been successfuly created");
  } catch (err) {
    res.status(501).json({
      status: "fail",
      message: "An error occurred",
      errMessage: err.message,
    });
  }
};
exports.login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }

  // Find user by email and include password field
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  // Check if user exists and if the password matches
  if (!user || !(await user.matchPassword(user.password, req.body.password))) {
    return res.status(404).json({
      status: "fail",
      message: "User not found or your password is incorrect",
    });
  }

  // Send the token if login is successful
  sendToken(user, 200, res, "You are logged in successfully");
};
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.JWT) {
    token = req.cookies.JWT;
  }
  if (!token) {
    return res.send("You must login first");
  }
  const decode = await promisify(jwt.verify)(token, process.env.jwtSecret);
  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return res.send("Your user not found");
  }

  req.session.user = freshUser;
  next();
};
exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      return res.send("you are not allowed to be here");
    }
    next();
  };
};
