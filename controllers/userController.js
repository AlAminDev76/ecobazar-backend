const User = require ('../models/userModel')

let getAllUsers = async(req,res)=>{
    let userData = await User.find({})
    res.send({
        message : "All user Data", userData
    })
}

let singleUserController = async(res,req)=>{
    let {id}=req.params
    let userData = await User.findById(id)
     res.send({
        message : `${userData.email},data`,userData
    })
}
let deleteUserController = async(req,res)=>{
    let {id}=req.params
    let userData = await User.findByIdAndDelete(id)
    res.send({
        message: "User Deleted"
    })
}
let UpdateUserController = async(req,res)=>{
    let {id}=req.params
    let userData = await User.findByIdAndUpdate({_id:id},req.body,{new:true})
     res.send({
        message: "User Updated"
    })
}


module.exports={getAllUsers,
    singleUserController,
    deleteUserController,
    UpdateUserController}