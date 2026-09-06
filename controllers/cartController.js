const Cart = require('../models/cartModel')
const product = require ('../models/productModel')

const  createCart = async (req, res)=>{
    const {id}= req.params

    const existingProduct = await product.findOne({id})
     if (!existingProduct){
        res.send(
             success: true,
        message: "product is not found",
        )
     }
      let cart = new Cart({
            product: id,
            quantity: 1
        });
    
        await cart.save();

      
        res.status(201).json({
            success: true,
            message: "Product added to cart successfully",
     
})
}