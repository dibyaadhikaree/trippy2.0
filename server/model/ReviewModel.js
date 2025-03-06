const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  place: { type: String, ref: "Place" },
  text: String,
  timestamp: Date,
  sentiment_score: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
