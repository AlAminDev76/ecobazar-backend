const { emptyFieldValidation } = require ('../utils/validation')
const Product = require('../models/productModel');
const existingData = require("../utils/existingData")

const createProductController = async (req,res)=>{
    const {title,price,category} = req.body
   emptyFieldValidation(title,price,category)
   let users = await existingData(res, { title });
     if (users) {
      return res.json({
        success: false,
        message: "Product with this title already exists",
      });
    }
    const sku = `${Data.now()}-${Data.gelFullYear()}`

     users = await existingData(res, { sku });
     if (users) {
      return res.json({
        success: false,
        message: "Product with this sku already exists",
      });
    }
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
// All product get
  let getProductController =  async (req,res)=>{
    try{
      let product = await Product.find({})
      res.json({
        success: true,
        product
      })
    }catch(error){
      res.json({
        success: false,
        message: 'server error'
      })
    }   
  }
// single product get
let getSingleProductController = async(req,res)=>{
    try{
      const {id}=req.params
      const singleProduct = await product.findOne({_id:id})
      res.json({
        success: true,
        product
      })
    }catch(error){
      res.json({
        success: true,
        message: 'server error'
      })
    }
}
// delete product get 
// delete product
let DeleteProductController = async (req, res) => {
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
let updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const updateProduct = await Product.findByIdAndUpdate(
     { _id:id},
      req.body,
      { new: true }
    );

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
  updateProductController
}