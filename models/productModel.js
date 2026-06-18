const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
  
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      min:0,
      default: 0, 
    },

    sku: {
      type: String,
      unique: true,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min:0,
      default: 0,
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    images: [
      {
       URL:{
        type: String,
        isMain:{
          type: Boolean,
          default: false
        }
       }
      }
    ],

    ratings: {
      type: Number,
      default: 0,
    },


    isFeatured: {
      type: Boolean,
      default: false,
    },
    tag:[{
        type: String,
    }],

    status: {
      type: String,
      enum: ["pending","active", "inactive"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);