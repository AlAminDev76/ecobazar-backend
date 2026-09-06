require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");

const bdConfig = require("./config/dbConfig");


// Controllers
const {
  registrationController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  resetVerificationMailController,
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
  updateProductController,
} = require("./controllers/productController");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/products');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" +  file.originalname);
  },
});

const upload = multer({ storage: storage });
// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { default: axios } = require("axios");

// Middlewares
app.use(express.json());
app.use(cors());

// DB connect
bdConfig();

/* ========================
   Swagger Config
======================== */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth & User API",
      version: "1.0.0",
      description: "Authentication and User Management API Documentation"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ]
  },
  apis: ["./server.js"] // Swagger comments this file e thakbe
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ========================
   AUTH ROUTES
======================== */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /registration:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *               - terms
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               confirmPassword:
 *                 type: string
 *                 example: 123456
 *               terms:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Registration response
 */
app.post("/registration", registrationController);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 */
app.post("/login", loginController);

/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Forgot password
 *     tags: [Authentication]
 */
app.post("/forgotPassword", forgotPasswordController);

/**
 * @swagger
 * /resetPassword/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 */
app.post("/resetPassword/:token", resetPasswordController);

/**
 * @swagger
 * /resetVerificationMail:
 *   post:
 *     summary: Resend verification email
 *     tags: [Authentication]
 */
app.post("/resetVerificationMail", resetVerificationMailController);

/**
 * @swagger
 * /verifyEmail/{token}:
 *   get:
 *     summary: Verify email
 *     tags: [Authentication]
 */
app.get("/verifyEmail/:token", verifyEmailController);

//product create
app.post('/createProduct', upload.array('photos', 12), createProductController)
app.get("/allProduct", getProductController);
app.get("/singleProduct/:id", getSingleProductController);
app.delete("/deleteProduct/:id", DeleteProductController);
app.post("/updateProduct/:id",upload.array('photos', 12), updateProductController);

/* ========================
   USER ROUTES
======================== */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management APIs
 */

/**
 * @swagger
 * /allusers:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 */
app.get("/allusers", getAllUsers);

/**
 * @swagger
 * /singleuser/{id}:
 *   get:
 *     summary: Get single user
 *     tags: [Users]
 */
app.get("/singleuser/:id", singleUserController);

/**
 * @swagger
 * /deleteuser/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 */
app.delete("/deleteuser/:id", deleteUserController);

/**
 * @swagger
 * /updateuser/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 */
app.put("/updateuser/:id", UpdateUserController);

//payment
app.post("/payment", async function (req, res) {
  let data = await axios.post(
    "https://sandbox.aamarpay.com/jsonpost.php",
    {
      store_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      ...req.body,
      tran_id: Date.now(),
      currency: "BDT",
      success_url: "https://example.com/success.php",
      fail_url: "https://example.com/fail.php",
      cancel_url: "https://example.com/cancel.php",
      desc: "Lend Money",
      type: "json",
    }
  );

  res.send(data.data);
});

/* ========================
   START SERVER
======================== */

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger Docs: http://localhost:${port}/api-docs`);
});