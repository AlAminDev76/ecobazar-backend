const jwt = require('jsonwebtoken')

let secureMiddleWare = (req,res,next)=>{
  let token = req.headers.authorization;
    //    let data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if(err){
           req.send({message : "unauthorized"})
        }
        else{}{
            next()
        }
  
});

}
module.exports = secureMiddleWare