const Category = require("../models/categoryModel");
const { serverError, responseToUser } = require("../utils/response");
const mongoose = require("mongoose");

exports.createCategory = async (req, res) => {
  try {
    const isCategoryExits = await Category.findOne({
      categoryName: req.body.categoryName,
    });

    if (isCategoryExits) {
      res
        .status(400)
        .json(responseToUser(false, 400, "Category already exists"));
    } else {
      const newCategory = await new Category({
        categoryName: req.body.categoryName,
        icon: req.body.icon,
      });
      const savedCategory = await newCategory.save();

      res
        .status(200)
        .json(
          responseToUser(
            true,
            200,
            "Category created  successfully",
            savedCategory
          )
        );
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res
      .status(200)
      .json(
        responseToUser(
          true,
          200,
          "Categories fetched  successfully",
          allCategories
        )
      );
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.deleteCategory = async (req, res) => {
  const id = req.params.id.trim();

  try {
    const isCategoryExists = await Category.findById(id);
    if (isCategoryExists) {
      await Category.findByIdAndDelete(id);
      res
        .status(200)
        .json(responseToUser(true, 200, "Category deleted  successfully"));
    } else {
      res
        .status(400)
        .json(responseToUser(false, 400, "Category doesn't exists"));
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};

exports.updateCategory = async (req, res) => {
  const id = req.params.id.trim();

  try {
    const isCategoryExists = await Category.findById(id);
    if (isCategoryExists) {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );

      res
        .status(200)
        .json(
          responseToUser(
            true,
            200,
            "Category updated  successfully",
            updatedCategory
          )
        );
    } else {
      res
        .status(400)
        .json(responseToUser(false, 400, "Category doesn't exists"));
    }
  } catch (error) {
    res.status(500).json(serverError());
  }
};
