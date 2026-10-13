const User = require("../models/userModel");

require("dotenv").config();

const {
    mailVerification,
    resetPasswordMail
} = require("../utils/email");

const { emptyFieldValidation } = require("../utils/validation");

const existingData = require("../utils/existingData");

const tokenGenerator = require("../utils/tokenGenerator");

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')



// ========================
// Registration
// ========================

let registrationController = async (req, res) => {
    try {
        const { email, password, confirmPassword, terms } = req.body;

        // Check existing user
        const users = await existingData(res, { email: email });

        if (users) {
            return res.status(400).send("User already exists");
        }

        // Terms check
        if (!terms) {
            return res.status(400).send({
                success: false,
                message: "Please accept our Terms and Conditions"
            });
        }

        emptyFieldValidation(res, email, password, confirmPassword)

        // Password check
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }

        // Password hashing
        const hash = bcrypt.hashSync(password, 10);

        // Create user
        let user = new User({
            email: email,
            password: hash,
            terms: terms
        });

        await user.save();

        // Generate token
        let token = tokenGenerator(
            {
                id: user._id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            "1d"
        );

        await mailVerification(token, email);

        return res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ========================
// Login
// ========================

let loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        let users = await existingData(res, { email: email });

        if (!users) {
            return res.status(404).send("User not found");
        }

        // Empty field check
        emptyFieldValidation(res, email, password)

        // Compare password
        let pass = bcrypt.compareSync(password, users.password);

        if (!pass) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ========================
// Forgot Password
// ========================

let forgotPasswordController = async (req, res) => {

    let { email } = req.body

    const users = await existingData(res, { email: email });

    if (!users) {
        return res.status(404).send("User not found");
    }

    // Generate token
    let token = tokenGenerator(
        {
            id: users._id,
            email: users.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        "1d"
    );

    await resetPasswordMail(token, email);

    res.send({
        message: "Please Check Your Email"
    })
}


// ========================
// Reset Password
// ========================

let resetPasswordController = (req, res) => {

    let { newPassword, confirmPassword } = req.body

    let { token } = req.params
    //  match check
    if (newPassword !== confirmPassword) {
        return res.status(400).send("Password does not match");
    }
    // jwt
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if(err){
               req.send({message : "unauthorized"})
            }
            else{}{
               const hash = bcrypt.hashSync(newPassword, 10);
            }
      
    });

}
// ========================
// resetVerificationMail
// ========================


let resetVerificationMail = async (req, res) => {
    try {
        let { email } = req.body;

        let user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Generate token
        let token = tokenGenerator(
            {
                id: user._id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            "1d"
        );

        // Send verification email এখানে করতে হবে

        return res.status(200).json({
            message: "Verification token generated successfully",
            token: token
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// ========================
// verifyEmail
// ========================

let verifyEmailController = (req,res)=>{
    let {token}= req.params

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded) {
            if(err){
               req.send({message : "unauthorized"})
            }
            else{
                const userId= decoded.id
                let findUser= await User.findById(userId) 
                if(findUser.isVerified){
                  return res.send({ message: "User already verified" });
                }
                else{
                    findUser.isVerified = true
                    findUser.save()
                   return res.send({ message: "Email verified successfully" });
                }

            }
      
    });
  

    
}




// ========================
// Export
// ========================

module.exports = {
    registrationController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    resetVerificationMail,
    verifyEmailController
};