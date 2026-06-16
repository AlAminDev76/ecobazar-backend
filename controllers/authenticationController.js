const {mailVerification,resetPasswordMail } = require("../utils/email")
const User = require('../models/userModel')
const  {emptyFieldValidation}  = require("../utils/validation")
const tokenGenerator = require("../utils/tokenGenerator")
const existingData = require("../utils/existingData")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//registration
let registrationController = async(req,res)=>{
  const {email,password,confirmPassword,terms}=req.body
  

 let users = await existingData(res, { email })

if (users) {
    return res.send({
        success: false,
        message: "An account with this email already exists."
    })
}

  if (!terms) {
    return res.send({
       success: false,
       message: "You must accept the Terms and Conditions to continue."
     });
}

if(emptyFieldValidation(res, email, password, confirmPassword)){
   return
}
 
  if (password !== confirmPassword){
    return res.send({
      success: false,
      message: "Password and Confirm Password do not match."
    })
  }
  const hash = bcrypt.hashSync(password, 10);

  let user = new User({
    email:email,
    password:hash,
    terms:terms
  })
  await user.save()

let token = tokenGenerator({id: user._id,
    email:user.email},process.env.ACCESS_TOKEN_SECRET,"1d")
mailVerification (token,email)
  
 return res.send({
    success: true,
    message: "Registration completed successfully. Please verify your email."
 })
}
//login
let loginController  = async(req,res)=>{
 const {email,password}=req.body
  

 let users = await User.findOne({email:email})

if(!users){
   return res.send({
       success: false,
       message: "No account found with this email address."
   })
}
emptyFieldValidation(res, email, password)

let pass = bcrypt.compareSync(password, users.password);

if (!pass){
     return res.send({
      success: false,
    message: "Invalid email or password."
     })
}
res.send({ 
   success: true,
   message: "Login successful."})
}
//forgotPassword
let forgotPasswordController  = async(req,res)=>{
   let {email}=req.body
   emptyFieldValidation(res, email)

  let users = await User.findOne({email:email})

   if (!users){
      return res.send({
          success: false,
          message: "No account found with this email address."
      })
   }
   let token = tokenGenerator({id: users._id,
    email:users.email},process.env.ACCESS_TOKEN_SECRET,"1d")

     resetPasswordMail (token,email)
     res.send({
       success: true,
      massage: "Please check your email"
     })     
}
//RESET PASSWORD
let resetPasswordController  = (req,res)=>{
   let {newPassWord,confirmPassword} = req.body
   let {token}=req.params
   if(newPassWord != confirmPassword){
      return res.send({
        success: false,
        message: "New password and Confirm Password do not match."
      })
   }
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,  async function (err, decoded) {
           if(err){
              req.send({
               success: false,
               message: "Unauthorized access."
              })
           }
           else{
               const hash = bcrypt.hashSync(newPassWord,10)
               const updateData = await User.findByIdAndUpdate({
                  _id: decoded.id},{password:hash},{new:true})
                  res.send({
                     success: true,
                     message: "Password has been updated successfully.", updateData
                  })
           }
   });
}
//reset verification email
let resetVerificationMailController  = async(req,res)=>{
   let {email}=req.body
   let user = await User.findOne({email:email})
   let token = tokenGenerator({id: users._id,
    email:users.email},process.env.ACCESS_TOKEN_SECRET,"1d")

     mailVerification (token,email)

     res.send({
     success: true,
    message: "Verification email has been sent successfully."
     })
}
// verify Email
let verifyEmailController = async(req,res)=>{
   let {token}= req.params
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded) {
        if(err){
           req.send({
            success: false,
            message : "unauthorized"})
        }
        else{
          const userId = decoded.id
          let findUser = await User.findById(userId)
          if(findUser.isVerified){
            return res.send({
               success: false,
               message: "This email address has already been verified."
            })
          }else{
            findUser.isVerified = true
         await findUser.save()
             res.send({
                success: true,
                message: "Email verified successfully."
            })

          }
        }
  
});
}



module.exports = {registrationController,loginController ,forgotPasswordController ,resetPasswordController ,resetVerificationMailController ,verifyEmailController}