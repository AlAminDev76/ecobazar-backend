
const {mailVerification } = require("../utils/email")
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

let registrationController = async(req,res)=>{
  const {email,password,confirmpassword,terms}=req.body

  let existingUser = await User.findOne({
    email:email
  }) 

  if (existingUser){
    return res.send({message : "User already exists"})
  }


  if(!terms){
   return res.send({message :"please accept  our terms and condition"})
  }
  if (!email || !password || !confirmpassword){
     return res.send({message: "please fill all the field"})
  }
  if (password !== confirmpassword){
    return res.send({message:"password not matched"})
  }
  let user = new User({
    email:email,
    password:password,
    terms:terms
  })
  await user.save()

  let token = jwt.sign({
    id: user._id,
    email:user.email
  },process.env.ACCESS_TOKEN_SECRET,{
   expiresIn: '1d'
  })
  
mailVerification (token)
  
 return res.send({message:"registration successful"})
}

module.exports = {registrationController}