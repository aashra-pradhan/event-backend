const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  bannerName: {
    type: String,
    required: [true, "Banner name is required"],
  },

  bannerImage: {
    type: {
      id: String,
      name: String,
    },
    required: [true, "Banner image is required"],
  },
  validTill: {
    type: Date,
    required: [true, "Banner Valid till date is required"],
  },
});

const promotionBanner = new mongoose.model("Promotion", promotionSchema);

module.exports = promotionBanner;
