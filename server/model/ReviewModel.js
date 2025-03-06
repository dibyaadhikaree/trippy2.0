const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  place: { type: String, ref: "Place" },
  text: String,
  timestamp: Date,
  sentiment_score: Number,
  rate: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
