const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const menuRouter = require("./routes/menuRouter");
const session = require("express-session");

const indexRouter = require("./routes/indexRouter");
const orderRouter = require("./routes/orderRouter");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
app.use(express.json());
app.use(flash());
app.use((req, res, next) => {
  req.Time = new Date().toISOString();
  next();
});
app.use(
  session({
    secret: "your-secret-key", // Replace with a secure secret key
    resave: false, // Forces the session to be saved back to the store
    saveUninitialized: true, // Saves uninitialized sessions (e.g., when not modified)
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration (1 day in this case)
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: false, // Set true if using HTTPS
    },
  })
);

app.get("/", (req, res, next) => {
  console.log(req.session);
  next();
});
app.use(cookieParser());
app.use("/", indexRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/admin", adminRouter);
app.use("*", function (req, res) {
  res.send(`We can not find this path ${req.originalUrl}`);
});
module.exports = app;
