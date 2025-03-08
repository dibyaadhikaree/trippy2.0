const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Main category name (e.g., "Food & Dining")
  subcategories: [{ type: String }], // Array of subcategories
});

module.exports = mongoose.model("Category", categorySchema);
