const Cart = require("../models/cartModel");
const axios = require("axios");
const Order = require("../models/orderModel")

const paymentController = async (req, res) => {
    const{userId,cus_name,cus_email,cus_add1,cus_add2,cus_city,cus_state,cus_postcode,cus_country,cus_phone,}=req.body
    
    try {
      const cart = await Cart.find({ user: userId }).populate("product").populate("user") ;

    let totalPrice = 0;
let totalDiscount = 0;
let pro = []
cart.map((item) => {
  // const proDetails = {...item.product}
  pro.push( {
    title: item.product.title,
    price: item.product.price,
    discount: item.product.discount,
    sku: item.product.sku,
    stock: item.product.stock,
    category: item.product.category,
    subCategory: item.product.subCategory,
    brand: item.product.brand,
    images: item.product.images,
    quantity: item.quantity,
    totalPrice: item.totalPrice
  })
  //  proDetails. quantity = item.quantity
  //  proDetails.totalPrice= item.totalPrice
  

  //  const quantity = item.quantity;
  // const price = item.product.price;
  // const itemTotalPrice = price * quantity;

 totalPrice += item.product.price * item.quantity;
//  totalDiscount += (item.product.price * item.product.discount / 100) * item.quantity;
 
  // console.log(quantity, itemTotalPrice);
});
// totalPrice = totalPrice - totalDiscount;
// res.send({
//   product: pro,
//   totalPrice: totalPrice
// })






    const paymentData = {
      store_id: "aamarpaytest",
      tran_id: "12355587",
      success_url: "http://localhost:5000/payment/success",
      fail_url: "http://localhost:5000/payment/fail",
      cancel_url: "http://localhost:5000/payment/cancel",
      amount:totalPrice,
      currency: "BDT",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      desc: "Merchant Registration Payment",
      cus_name: cus_name,
      cus_email: cus_email,
      cus_add1:  cus_add1,
      cus_add2: cus_add2,
      cus_city: cus_city,
      cus_state: cus_state,
      cus_postcode: cus_postcode,
      cus_country: cus_country,
      cus_phone: cus_phone,
      type: "json",
    };

    const response = await axios.post(
      "https://sandbox.aamarpay.com/jsonpost.php",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );
       const order = new Order({
  user: userId,

  products: cart.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    totalPrice: item.product.price * item.quantity,
    sku: Number(item.product.sku),
  })),

  totalPrice: totalPrice,

  shippingAddress: {
    fullName: cus_name,
    phone: cus_phone,
    address: cus_add1,
    city: cus_city,
    postalCode: cus_postcode,
  },

  paymentMethod: "AAMARPAY",
  paymentStatus: "pending",
  tranid: paymentData.tran_id,
  Status: "pending",
});

await order.save();
     return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Payment Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Payment request failed",
      error: error.response?.data || error.message,
    });
  }
};
const getAllOrderController = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
  .populate("user", "name email")
  .populate("products.product")
  .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAllOrderController };

module.exports = {paymentController,getAllOrderController};
