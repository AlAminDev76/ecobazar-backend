const { emptyFieldValidation } = require("../utils/validation");
const Product = require("../models/productModel");
const existingData = require("../utils/existingData");

// create product
const createProductController = async (req, res) => {
  try {
    const { title, price, category } = req.body;

    if (emptyFieldValidation(res, title, price, category)) return;

    let existing = await existingData(res, { title });
    if (existing) {
      return res.json({
        success: false,
        message: "Product with this title already exists",
      });
    }

    const sku = `${Date.now()}-${new Date().getFullYear()}`;

    existing = await existingData(res, { sku });
    if (existing) {
      return res.json({
        success: false,
        message: "Product with this sku already exists",
      });
    }

    const product = new Product({
      ...req.body,
      sku,
    });
    await product.save();

    res.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Server error",
    });
  }
};

// get all products
const getProductController = async (req, res) => {
  try {
    const product = await Product.find({});
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Server error",
    });
  }
};

// get single product
const getSingleProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const singleProduct = await Product.findOne({ _id: id });

    if (!singleProduct) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: singleProduct,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Server error",
    });
  }
};

// delete product
const DeleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Server error",
    });
  }
};

// update product
const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Product updated",
      updateProduct,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createProductController,
  getProductController,
  getSingleProductController,
  DeleteProductController,
  updateProductController,
};