
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// create cart
const createCart = async (req, res) => {
 
    const { userId, productId} = req.body;

    i

    const existingProduct = await Product.findOne({_id: productId});

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const cart = new Cart({
      user: userId,
      products: productId,
      quantity: quantity || 1,
    });

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      cart,
    });
  
};

// increment / decrement quantity
const increDecre = async (req, res) => {
  
    const { id } = req.params;
    const { type } = req.body;

    const product = await Cart.findById(id);
    console.log(product)
    if (!product) {
  return res.status(404).json({
    success: false,
    message: "Cart item not found",
  });
}

    

    if (type === "plus") {
     product.quantity += 1; 
       await product.save();
    }else{
       product.quantity -=  1;
        await product.save();
    }
    
    return res.json({
      success: true,
      message: "Cart update successful",
      cart: product,
    });
  } 


// delete cart item
const proDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findByIdAndDelete(id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("Delete Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get cart by user ID

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.find({ user: userId })
      .populate("user")
      .populate("products");

    let totalPrice = 0;

    cart.forEach((item) => {
      if (item.products) {
        totalPrice += item.products.price * item.quantity;
      }
    });

    return res.json({
      success: true,
      cart,
      totalPrice,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createCart,
  increDecre,
  getCart,
  proDelete,
};
