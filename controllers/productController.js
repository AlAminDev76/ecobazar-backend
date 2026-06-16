const { emptyFieldValidation } = require ('../utils/validation')
const Product = require('../models/productModel');
const existingData = require("../utils/existingData")

const createProductController = async (req,res)=>{
    const {title,price,category} = req.body
   emptyFieldValidation(title,price,category)
   let users = await existingData(res, { title });

  let product = new Product({
      ...req.body,
      sku: sku
    });
    await product.save();

    res.json({
      success: true,
      message: "Product created successfully",
      product,
    });

    
}
module.exports = {
   createProductController
}