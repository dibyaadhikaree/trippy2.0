const mongoose = require("mongoose");

// booking  = guest renting a cabin
// i.e connecting cabin with guest

const usersSchema = new mongoose.Schema({
  name: { type: String, required: [true, "A  name is required"] },
  email: {
    type: String,
  },

  preferences: [String],
  likedPlaces: [
    {
      type: String,
      ref: "",
    },
  ],
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
