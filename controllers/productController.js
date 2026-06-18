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

    let users = await existingData(res, { sku });
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
let DeleteProductController = async(req,res)=>{
  try{
    const {id}=req.params
    const deleteProduct = await product.findByIdAndDelete(id)
     res.json({
        success: true,
        message:'product delete'
      })
  }catch(error){
    res.json({
        success: false,
        message:'server error'
      })
  }
// update product get
let updateProductController = async(req,res)=>{
  try{
     const {id}=req.params
    const updateProduct = await product.findByIdUpdate({_id:id},req.body,{new:true})
    res.send({
       success: true,
        message: "product Updated"
    })
  }catch(error){
    res.json({
        success: false,
        message:'server error'
      })
  }
}
}





module.exports = {
   createProductController
}