const User = require("../models/userModel");

// get all users
let getAllUsers = async (req, res) => {
  try {
    let userData = await User.find({}).select("-password");
    res.send({
      success: true,
      message: "All user Data",
      userData,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Server error",
    });
  }
};

// get single user
let singleUserController = async (req, res) => {
  try {
    let { id } = req.params;
    let userData = await User.findById(id).select("-password");

    if (!userData) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      message: "Single user data",
      userData,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Server error",
    });
  }
};

// delete user
let deleteUserController = async (req, res) => {
  try {
    let { id } = req.params;
    let userData = await User.findByIdAndDelete(id);

    if (!userData) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      message: "User Deleted",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Server error",
    });
  }
};

// update user
let UpdateUserController = async (req, res) => {
  try {
    let { id } = req.params;
    let userData = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");

    if (!userData) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      message: "User Updated",
      userData,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAllUsers,
  singleUserController,
  deleteUserController,
  UpdateUserController,
};