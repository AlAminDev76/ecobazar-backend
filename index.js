require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bdConfig = require("./config/dbConfig")
const {registrationController}=require('./controllers/authenticationController')

//middleware
app.use(express.json())
app.use (cors())

//database Config
bdConfig()

app.post('/registration',registrationController)

let port = process.env.PORT || 5000
app.listen(5000,()=>{
    console.log(`server running on port ${port}`)
})