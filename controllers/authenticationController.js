const {mailVerification } = require("../utils/email")
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
        message: "User exists"
    })
}

  if (!terms) {
    return res.send({ message: "Please accept our terms and conditions" });
}

if(emptyFieldValidation(res, email, password, confirmPassword)){
   return
}
 
  if (password !== confirmPassword){
    return res.send({message:"password not matched"})
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
  
 return res.send({message:"registration successful"})
}
//login
let loginController  = async(req,res)=>{
 const {email,password}=req.body
  

 let users = await User.findOne({email:email})

if(!users){
   return res.send({
      message:"user already exists"
   })
}
emptyFieldValidation(res, email, password)

let pass = bcrypt.compareSync(password, users.password);

if (!pass){
     return res.send({massage:"invalid Credential"})
}
res.send({massage:"Login successfully"})
}
//forgotPassword
let forgotPasswordController  = async(req,res)=>{
   let {email}=req.body
   emptyFieldValidation(res, email, password)
   let users = await existingData(res,{email})

   if (!users){
      return res.send({
         massage: "User Already exists"
      })
   }
   let token = tokenGenerator({id: users._id,
    email:users.email},process.env.ACCESS_TOKEN_SECRET,"1d")

     resetPasswordMail (token,email)
     res.send({
      massage: "Please check your email"
     })     
}
//RESET PASSWORD
let resetPasswordController  = (req,res)=>{
   let {newPassWord,confirmPassword} = req.body
   let {token}=req.params
   if(newPassWord != confirmPassword){
      return res.send({
         massage:"confirmPassword not matched"
      })
   }
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
           if(err){
              req.send({message : "unauthorized"})
           }
           else{}{
               const hash = bcrypt.hashSync(newPassWord,10)
               const updateData = user.findByIdAndUpdate({
                  _id: decoded.id},{password:newPassWord})
                  res.send({
                     massage: "password Updated"
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
      massage: "Reset password email sent successfully"
     })
}
// verify Email
let verifyEmailController = async(req,res)=>{
   let {token}= req.params
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded) {
        if(err){
           req.send({message : "unauthorized"})
        }
        else{
          const userId = decoded.id
          let findUser = await User.findById(userId)
          if(findUser.isVerified){
            return res.send({massage:"User Already Verified"})
          }else{
            findUser.isVerified = true
            findUser.save()
             res.send({
               massage: "Email Verified successfully"
            })

          }
        }
  
});
}



module.exports = {registrationController,loginController ,forgotPasswordController ,resetPasswordController ,resetVerificationMailController ,verifyEmailController}