const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const multer = require("multer");
const { serverError, responseToUser } = require("../utils/response");

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s/g, ""));
  },
});

exports.upload = multer({
  storage: Storage,
});

exports.addProduct = async (req, res) => {
  const userId = req.body.userId.trim();
  const user = await User.findById(userId);
  const productCategory = await Category.findById(req.body.category);
  console.log(productCategory);

  try {
    const product = {
      userId: userId,
      username: req.body.username,
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      requirements: req.body.requirements,
      category: {
        id: productCategory._id,
        category: productCategory.categoryName,
      },
      quantity: req.body.quantity,
      // price: req.body.price,
      productImages: req.files.map((file) => {
        return {
          id: Date.now() + "_" + file.filename.split(".png")[0],
          name: file.filename,
        };
      }),
      // };
      location: req.body.location,
      date: req.body.date,
      time: req.body.time,
      isPrivate: req.body.isPrivate,
      marketing: req.body.marketing,
      ticketPrice: req.body.ticketPrice,
      // maxAttendees: req.body.maxAttendees,
      // coverImage: req.files.map((file) => {
      //   return {
      //     id: Date.now() + "_" + file.filename.split(".png")[0],
      //     name: file.filename,
      //   };
      // }),
      eventStatus: req.body.eventStatus,
      totalTicketsSold: 0, // Initialize to 0
    };

    user?.products?.push(product);
    console.log(user, "user");
    const updatedUser = await user?.save();
    res
      .status(201)
      .json(
        responseToUser(
          true,
          201,
          "Product added  successfully",
          updatedUser?.products
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(serverError());
  }
};

exports.fetchUserListedProducts = async (req, res) => {
  const userId = req.params.userId.trim();
  const user = await User.findById(userId);
  const myProducts = user.products;
  try {
    if (myProducts.length <= 0) {
      res
        .status(200)
        .json(
          responseToUser(true, 200, "You don't have any products listed.", [])
        );
    } else {
      const responseData = myProducts.map((product) => {
        const productWithImageURLs = product;

        productWithImageURLs.productImages = product.productImages.map(
          (imageFile) => {
            return {
              id: imageFile.id,
              url: `${req.protocol}://${req.get("host")}/uploads/${
                imageFile.name
              }`,
            };
          }
        );
        return productWithImageURLs;
      });

      res
        .status(200)
        .json(
          responseToUser(
            true,
            200,
            "Product fetched  successfully",
            responseData
          )
        );
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.deleteProduct = async (req, res) => {
  const { userId, productId } = req.params;
  const user = await User.findById(userId);

  try {
    if (user) {
      const productsAfterDelete = user.products.filter(
        (product) => String(product._id) !== productId
      );
      user.products = productsAfterDelete;
      user.save();
      res
        .status(200)
        .json(
          responseToUser(
            true,
            200,
            "Product Deleted Successfully.",
            user.products
          )
        );
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.deleteProductImage = async (req, res) => {
  const { userId, productId, imageId } = req.params;
  const user = await User.findById(userId);

  try {
    if (user) {
      const productImageToDelete = user.products.find(
        (product) => String(product._id) === productId
      );
      const updatedProductAfterImageDeletion =
        productImageToDelete.productImages.filter(
          (image) => image.id !== imageId
        );

      productImageToDelete.productImages = updatedProductAfterImageDeletion;

      user.save();
      res
        .status(200)
        .json(
          responseToUser(
            true,
            200,
            "Product Deleted Successfully.",
            user.products
          )
        );
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};

const updateData = (id, newData, oldDataArray) => {
  const updatedDataArray = oldDataArray.map((item) => {
    if (String(item._id) === id) {
      return {
        ...item,
        ...newData,
      };
    }
    return item;
  });

  return updatedDataArray;
};

exports.updateProduct = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(responseToUser(false, 404, "User not found."));
    }

    const productIndex = user.products.findIndex(
      (product) => String(product._id) === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json(responseToUser(false, 404, "Product not found."));
    }

    const product = user.products[productIndex];

    // Update product fields
    product.name = req.body.name?.toString();
    product.shortDescription = req.body.shortDescription?.toString();
    product.description = req.body.description?.toString();
    product.requirements = req.body.requirements?.toString();
    product.location = req.body.location?.toString();
    product.date = req.body.date?.toString();
    product.time = req.body.time?.toString();
    product.isPrivate = req.body.isPrivate;
    product.marketing = req.body.marketing;
    product.ticketPrice = req.body.ticketPrice;
    product.eventStatus = req.body.eventStatus;
    product.quantity = req.body.quantity;

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      product.productImages = req.files.map((file) => ({
        id: Date.now() + "_" + file.filename.split(".png")[0],
        name: file.filename,
      }));
    }

    await user.save();

    res
      .status(200)
      .json(
        responseToUser(
          true,
          200,
          "Product updated Successfully.",
          user.products
        )
      );
  } catch (error) {
    console.error(error);
    res.status(500).json(serverError());
  }
};

exports.getProductDetail = async (req, res) => {
  const { userId, productId } = req.params;
  await User.updateOne(
    { _id: userId, "products._id": productId },
    { $inc: { "products.$.viewCount": 1 } }
  );
  const user = await User.findById(userId);
  let productDetail = {};
  try {
    if (user) {
      productDetail = user.products.find(
        (product) => String(product._id) === productId
      );
      console.log(productDetail, "hello");
      const productWithImage = {
        _id: productDetail?._id,
        ratings: productDetail?.averageRating,
        category: productDetail?.category?.category,
        userId: productDetail?.userId,
        name: productDetail?.name,
        shortDescription: productDetail?.shortDescription,
        description: productDetail?.description,
        viewCount: productDetail?.viewCount,
        quantity: productDetail?.quantity,
        // price: product?.price,
        location: productDetail?.location,
        date: productDetail?.date,
        time: productDetail?.time,
        isPrivate: productDetail?.isPrivate,
        marketing: productDetail?.marketing,
        ticketPrice: productDetail?.ticketPrice,
        // maxAttendees: product?.maxAttendees,
        eventStatus: productDetail?.eventStatus,
        totalTicketsSold: productDetail?.totalTicketsSold,
        productImages: productDetail?.productImages?.map((pImage) => ({
          ...pImage,
          url: `${req.protocol}://${req.get("host")}/uploads/${pImage.name}`,
        })),
      };

      res
        .status(200)
        .json(
          responseToUser(
            true,
            200,
            "Product details fetched successfully.",
            productWithImage
          )
        );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(serverError());
  }
};

exports.fetchAllProducts = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 30;
  const categoryId = req.query.categoryId;
  const category = req.query.category;
  const productName = req.query.productName;

  const allProducts = [];
  try {
    const allUsers = await User.find();

    allUsers.map((user) => {
      allProducts.push(...user.products);
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let filteredProducts = [];

    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    if (categoryId) {
      filteredProducts = paginatedProducts.filter(
        (product) => String(product.category.id) === categoryId
      );
    } else if (category) {
      filteredProducts = paginatedProducts.filter((product) => {
        return product.category.category
          .toLowerCase()
          .includes(category.toLowerCase());
      });
    } else if (productName) {
      filteredProducts = paginatedProducts.filter((product) => {
        return product.name.toLowerCase().includes(productName.toLowerCase());
      });
    } else {
      filteredProducts = paginatedProducts;
    }

    const productList = filteredProducts.map((product) => {
      console.log(product, "hh");
      return {
        _id: product?._id,
        ratings: product?.averageRating,
        category: product?.category?.category,
        userId: product?.userId,
        name: product?.name,
        shortDescription: product?.shortDescription,
        description: product?.description,
        viewCount: product?.viewCount,
        quantity: product?.quantity,
        // price: product?.price,
        location: product?.location,
        date: product?.date,
        time: product?.time,
        isPrivate: product?.isPrivate,
        marketing: product?.marketing,
        ticketPrice: product?.ticketPrice,
        // maxAttendees: product?.maxAttendees,
        eventStatus: product?.eventStatus,
        totalTicketsSold: product?.totalTicketsSold,
        productImages: product?.productImages?.map((pImage) => ({
          ...pImage,
          url: `${req.protocol}://${req.get("host")}/uploads/${pImage.name}`,
        })),
      };
    });

    res
      .status(200)
      .json(
        responseToUser(true, 200, "Product  fetched successfully.", productList)
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(serverError());
  }
};

exports.purchaseProduct = async (req, res) => {
  const { products, quantity, customerId } = req.body;

  try {
    const requestedProducts = products.map(async (product) => {
      const updateUserProducts = await User.updateMany(
        { _id: product.userId, "products._id": product._id },
        {
          $inc: { "products.$.quantity": -quantity },
        }
      );
    });
    const customer = await User.findById(customerId);

    customer?.purchasedProducts?.push(...products);
    await customer.save();

    res
      .status(200)
      .json(responseToUser(true, 200, "Product  purchased successfully."));
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.giveRatingsAndReviews = async (req, res) => {
  const { userId, productId, customerId, rating, review } = req.body;
  let user = await User.findById(userId);

  let productForReviewIndex = user.products.findIndex(
    (product) => String(product._id) === productId
  );

  if (productForReviewIndex === -1) {
    return res
      .status(404)
      .json(responseToUser(false, 404, "Product not found."));
  }

  let productForReview = user.products[productForReviewIndex];

  const updatedReviews = [
    ...(productForReview.reviews || []),
    {
      reviewedBy: customerId,
      message: review,
    },
  ];

  const updatedRating = (+productForReview.rating || 0) + +rating;
  const updatedNumOfRatings = (productForReview.numOfRatings || 0) + 1;
  const updatedAverageRating = updatedRating / updatedNumOfRatings;

  const updatedData = {
    ...productForReview.toObject(), // Convert Mongoose document to plain JavaScript object
    reviews: updatedReviews,
    rating: updatedRating,
    numOfRatings: updatedNumOfRatings,
    averageRating: updatedAverageRating,
  };

  user.products[productForReviewIndex] = updatedData;

  try {
    await user.save();

    res
      .status(200)
      .json(responseToUser(true, 200, "Product reviewed successfully."));
  } catch (error) {
    res.status(500).json(serverError());
  }
};
