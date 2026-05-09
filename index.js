require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bdConfig = require("./config/dbConfig")

//middleware
app.use(express.json())
app.use (cors())

//database Config
bdConfig()

app.get('/',(req,res)=>{
   res.send("hello developer")
})
let port = process.env.port || 5000
app.listen(5000,()=>{
    console.log(`server running on port ${port}`)
})