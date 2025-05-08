const express = require("express");

const {
  addProduct,
  upload,
  fetchUserListedProducts,
  deleteProduct,
  deleteProductImage,
  updateProduct,
  getProductDetail,
  fetchAllProducts,
  purchaseProduct,
  giveRatingsAndReviews,
} = require("../controllers/productControllers");
const route = express.Router();
const { authToken } = require("../middlewares/authToken");

route.post(
  "/add-product",
  authToken,
  upload.array("productImages", 6),
  addProduct
);
route.get("/product/details/:userId/:productId", getProductDetail);
route.get("/user-products/:userId", authToken, fetchUserListedProducts);
route.delete("/user-product/:userId/:productId", authToken, deleteProduct);
route.delete(
  "/user-product-image/:userId/:productId/:imageId",
  authToken,
  deleteProductImage
);
route.put(
  "/user-product/:userId/:productId",
  authToken,
  upload.array("productImages", 6),
  updateProduct
);
route.get("/products", fetchAllProducts);
route.post("/purchase-products", authToken, purchaseProduct);
route.put("/rate-product", authToken, giveRatingsAndReviews);

module.exports = route;
