const express = require("express");
const {
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryControllers");
const { authToken } = require("../middlewares/authToken.js");
const route = express.Router();

route.post("/create-category", authToken, createCategory);
route.get("/categories", getAllCategory);
route.delete("/category/:id", deleteCategory);
route.put("/category/:id",authToken, updateCategory);

module.exports = route;
