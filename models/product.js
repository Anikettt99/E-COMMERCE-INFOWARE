const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    default: " ",
  },
  price: {
    type: Number,
    require: true,
  },

  image: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Product", ProductSchema);
