const {mailVerification } = require("../utils/email")
const User = require('../models/userModel')
const { emptyFieldValidation } = require("../utils/validation")
const tokenGenerator = require("../utils/tokenGenerator")

let registrationController = async(req,res)=>{
  const {email,password,confirmpassword,terms}=req.body

   emptyFieldValidation(email,password,confirmpassword,terms)

  let existingUser = await User.findOne({
    email:email
  }) 

  if (existingUser){
    return res.send({message : "User already exists"})
  }


  if(!terms){
   return res.send({message :"please accept  our terms and condition"})
  }
  emptyFieldValidation(email,password,confirmpassword,terms)
 
  if (password !== confirmpassword){
    return res.send({message:"password not matched"})
  }
  let user = new User({
    email:email,
    password:password,
    terms:terms
  })
  await user.save()

tokenGenerator({id: user._id,
    email:user.email},process.env.ACCESS_TOKEN_SECRET,"1d")
mailVerification (token,email)
  
 return res.send({message:"registration successful"})
}

module.exports = {registrationController}