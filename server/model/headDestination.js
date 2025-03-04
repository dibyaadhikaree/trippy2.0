const mongoose = require("mongoose");

const headDestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  lat: {
    type: Number,
    required: [true, "A latitude is required"],
  },
  lon: {
    type: Number,
    required: [true, "A latitude is required"],
  },

  populatiion: Number,
});

// {
//   "name": "kathmandu",
//   "lat": 27.70169,
//   "lon": 85.3206,
//   "population": 1442271
// }

module.exports = mongoose.model("HeadDestination", headDestinationSchema);
