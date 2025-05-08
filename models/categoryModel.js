const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Category is required"],
  },
  icon: {
    type: String,
    required: [true, "Icon is required"],
  },
});

const categoryModel = new mongoose.model("Category", categorySchema);

module.exports = categoryModel;
