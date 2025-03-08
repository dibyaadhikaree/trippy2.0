const mongoose = require("mongoose");

const mongoose = require("mongoose");

// booking  = guest renting a cabin
// i.e connecting cabin with guest

const citiesSchema = new mongoose.Schema({
  name: { type: String, required: [true, "A  name is required"] },
});

const City = mongoose.model("City", citiesSchema);

module.exports = City;
