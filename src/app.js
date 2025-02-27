const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")


app.post('/signup',async (req,res)=>{
    const user = new User({
        firstName :"jone",
        lastName:"doe",
        emailId :"jone@gmail.com",
        password:"jone@123"
    })
    try{
        await user.save()
        res.send("User addd successfully")
    }catch(err){
        res.status(400).send("error saving the users" + err.message)
    }
})



// remmeber first connect your database and then app.listen
connectDB().then(() =>{
    console.log("database connected successfully...")
    app.listen(7777,()=>{
        console.log("start server on 7777")
    })
 }).catch(err =>{
    console.error('database connot connect ')
 })



