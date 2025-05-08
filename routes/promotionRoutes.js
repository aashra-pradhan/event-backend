const express = require("express");
const {
  createPromotion,
  upload,
  getPromotions,
  deletePromotion,
} = require("../controllers/promotionControllers");

const route = express.Router();

route.post("/create-promotion", upload.single("bannerImage"), createPromotion);
route.get("/promotions", getPromotions);
route.delete("/promotion/:promotionId", deletePromotion);

module.exports = route;
