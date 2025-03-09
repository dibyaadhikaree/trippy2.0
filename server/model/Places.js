const mongoose = require("mongoose");

const placesSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Set _id explicitly
    name: String,
    description: String,
    img: [String],
    latitude: Number,
    longitude: Number,
    categories: [String],
    rate: Number,
    city: String,
  },
  { _id: false }
);

placesSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "place",
  localField: "_id",
});

// Make sure to set the schema option `toObject` and `toJSON` to `{ virtuals: true }` so it includes virtuals when you convert a document to JSON
placesSchema.set("toJSON", { virtuals: true });
placesSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Place", placesSchema);
