const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mongoStore = require("connect-mongo");
const emmiter = require("events");

dotenv.config({ path: "./config.env" });
const port = process.env.port || 3000;
const DB = process.env.db_string.replace("<PASSWORD>", process.env.dbPassword);

mongoose.connect(DB).then(() => {
  console.log("db connected successfully");

  const server = app.listen(port, () => {
    console.log(`Your app is listening on port ${port}`);
  });
});
const eventEmitter = new emmiter();
app.set("eventEmitter", eventEmitter);
eventEmitter.on("orderPlaced", (data) => console.log("order placed"));
