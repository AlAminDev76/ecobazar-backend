require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bdConfig = require("./config/dbConfig")
const { registrationController,loginController ,forgotPasswordController ,resetPasswordController ,resetVerificationMailController ,verifyEmailController } = require('./controllers/authenticationController')


app.use(express.json())
app.use(cors())


bdConfig()

app.post('/registration', registrationController)
app.post('/login', loginController)
app.post('/forgotPassword', forgotPasswordController)
app.post('/resetPassword', resetPasswordController)
app.post('/resetVerificationMail/:token', resetVerificationMailController)
app.post ('/verifyEmail/:token',verifyEmailController)

let port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})