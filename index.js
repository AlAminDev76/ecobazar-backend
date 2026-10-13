const User = require('./models/userModel')

require("dotenv").config();

const {
    mailVerification,
    resetPasswordMail
} = require("./utils/email");

const { emptyFieldValidation } = require("./utils/validation");

const existingData = require("./utils/existingData");

const tokenGenerator = require("./utils/tokenGenerator");

const bcrypt = require("bcrypt");

const express = require("express");


const cors = require("cors");

const multer = require("multer");

const app = express();


// Database

const bdConfig = require("./config/dbConfig");


// Controllers

const {
    registrationController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
   resetVerificationMail,
    verifyEmailController
} = require("./controllers/authenticationController");

const {
    getAllUsers,
    singleUserController,
    deleteUserController,
    UpdateUserController
} = require("./controllers/userController");

const {
    getProductController,
    createProductController,
    getSingleProductController,
    DeleteProductController,
    updateProductController
} = require("./controllers/productController");

const {
    createCart,
    increDecre,
    getCart,
    proDelete
} = require("./controllers/cartController");

const { findOne } = require('./models/productModel');



// ========================
// Middleware
// ========================

app.use(express.json());

app.use(cors());



// ========================
// Database
// ========================

bdConfig();



// ========================
// Registration
// ========================

app.post("/registation", registrationController);



// ========================
// Login
// ========================

app.post("/login", loginController);



// ========================
// Password
// ========================

app.post("/forgotPassword", forgotPasswordController);

app.post("/resetPassword/:token", resetPasswordController);

app.post( "/resetVerificationMail", resetVerificationMail);

app.get( "/verifyEmail/:token", verifyEmailController);



//========================
//Product
//========================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload/products");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueSuffix + "-" + file.originalname
        );
    }
});

const upload = multer({
    storage: storage
});

app.post(
    "/createProduct",
    upload.array("photos", 12),
    createProductController
);

app.get(
    "/allProduct",
    getProductController
);

app.get(
    "/singleProduct/:id",
    getSingleProductController
);

app.delete(
    "/deleteProduct/:id",
    DeleteProductController
);

app.post(
    "/updateProduct/:id",
    upload.array("photos", 12),
    updateProductController
);



//========================
//Users
//========================

app.get("/allusers", getAllUsers);

app.get("/singleuser/:id", singleUserController);

app.delete("/deleteuser/:id",deleteUserController);

app.put("/updateuser/:id", UpdateUserController);



// ========================
// Cart
// ========================

app.post("/cart/create",createCart);

app.post(
    "/cart/update/:id",
    increDecre
);

app.get(
    "/cart/:userId",
    getCart
);

app.delete(
    "/cart/:id",
    proDelete
);



// ========================
// Start Server
// ========================

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});