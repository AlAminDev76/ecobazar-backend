const jwt = require('jsonwebtoken')
let tokenGenerator = (data,secret,expire)=>{
let token = jwt.sign(data,secret,{
   expiresIn: expire
  })
}
module.exports = tokenGenerator