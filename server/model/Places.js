const mongoose = require("mongoose");
const headDestination = require("./headDestination");

const bboxSchema = new mongoose.Schema(
  {
    lon_min: Number,
    lon_max: Number,
    lat_min: Number,
    lat_max: Number,
  },
  { _id: false }
);

const placesSchema = new mongoose.Schema({
  xid: String,
  name: String,
  description: String,
  categories: [String],
  latitude: Number,
  longitude: Number,
  city: String,
  bbox: bboxSchema,
  image: String,
  rate: String,
  headDestination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HeadDestination",
  },
});

module.exports = mongoose.model("Place", placesSchema);
