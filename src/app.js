

const express = require("express")
const connectDB = require("./config/database.js")
const cors = require("cors")
// const { validateSignUpData } = require("./utils/validation.js")
const cookieParser = require("cookie-parser")
//const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")
// const { userAuth } = require("./middleware/auth.js")

const multer = require('multer');
const path = require('path');

const app = express()
// const User = require("./models/user")
const { now } = require("mongoose")
// express middleware 

require("dotenv").config()
app.use(cors({
    origin:"http://localhost:5175",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())





const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js")
const userRouter = require("./routes/user.js")
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)




//  first connect to  database and then app.listen
connectDB().then(() => {
    console.log("database connected successfully...")
    app.listen(process.env.PORT, () => {
        console.log("start server on 7777")
    })
}).catch(err => {
    console.error('database connot connect ', err.message)
})

