const mongoose = require("mongoose");

const placesSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Set _id explicitly
    name: String,
    description: String,
    img: String,
    latitude: Number,
    longitude: Number,
    categories: [String],
    rate: Number,
    city: String,
  },
  { _id: false }
);

module.exports = mongoose.model("Place", placesSchema);
