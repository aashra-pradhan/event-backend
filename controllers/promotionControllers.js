const { serverError, responseToUser } = require("../utils/response");
const Promotion = require("../models/promotionBannerModel");
const multer = require("multer");

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s/g, ""));
  },
});

exports.upload = multer({
  storage: Storage,
});

exports.createPromotion = async (req, res) => {
  try {
    const newPromotion = await new Promotion({
      ...req.body,
      bannerImage: {
        // id: Date.now() + "_" + req?.file.filename?.split(".png")[0],
        name: req?.file?.filename,
      },
    });
    const savedPromotion = await newPromotion.save();
    res
      .status(201)
      .json(
        responseToUser(
          true,
          201,
          "Promotion banner created successfully",
          savedPromotion
        )
      );
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.getPromotions = async (req, res) => {
  let allPromotions = await Promotion.find();
  const todayDate = Date.now();

  let activePromotions = [];

  try {
    const afterRemovingExpiredPromotions = allPromotions.map(
      async (promotion) => {
        if (new Date(promotion.validTill).getTime() >= todayDate) {
          activePromotions.push({
            id: promotion._id,
            name: promotion.bannerName,
            url: `${req.protocol}://${req.get("host")}/uploads/${
              promotion.bannerImage.name
            }`,
          });
        } else {
          await Promotion.findByIdAndDelete(promotion._id);
        }
      }
    );
    allPromotions = activePromotions;

    res
      .status(200)
      .json(
        responseToUser(
          true,
          200,
          "Promotion banner fetched successfully",
          allPromotions
        )
      );
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.deletePromotion = async (req, res) => {
  const { promotionId } = req.params;
  try {
    const promotionToDelete = await Promotion.findByIdAndDelete(
      String(promotionId)
    );
    res
      .status(200)
      .json(responseToUser(true, 200, "Promotion banner deleted successfully"));
  } catch (error) {
    res.status(500).json(serverError());
  }
};
