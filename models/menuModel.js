const mongoose = require("mongoose");
const menuSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must provide a name"],
    unique: true,
    minlength: 3,
  },
  price: {
    type: Number,
    required: [true, "You must provide a price"],
  },
  image: {
    type: String,
    required: [true, "Please upload a image"],
  },
  size: {
    type: String,
    enum: ["small", "large", "medium"],
    default: "small",
  },
});
module.exports = mongoose.model("Menu", menuSchema);
