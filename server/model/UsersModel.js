const mongoose = require("mongoose");

const Category = require("../model/CategoryModel");

// booking  = guest renting a cabin
// i.e connecting cabin with guest

const usersSchema = new mongoose.Schema({
  name: { type: String, required: [true, "A  name is required"] },
  email: {
    type: String,
  },

  selectedPreferences: [String],
  likedPlaces: [
    {
      type: String,
      ref: "Place",
    },
  ],
});

usersSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "user",
  localField: "_id",
});

// Make sure to set the schema option `toObject` and `toJSON` to `{ virtuals: true }` so it includes virtuals when you convert a document to JSON
usersSchema.set("toJSON", { virtuals: true });
usersSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", usersSchema);

module.exports = User;
