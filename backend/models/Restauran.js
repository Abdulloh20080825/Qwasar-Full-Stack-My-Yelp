const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  name: { type: String },
  description: { type: String },
  userId: { type: String, require: true },
});

module.exports = mongoose.model("Restauran", restaurantSchema);
