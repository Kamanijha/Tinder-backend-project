const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")
// express middleware 
app.use(express.json())

// this code is for understanding

// app.post('/signup', async (req,res)=>{
//     console.log(req.body)
//     res.send("sucess")
//     // creating a new instance of the User model
//     const user = new User({
//         firstName :"suman",
//         lastName:"doe",
//         emailId :"suman@gmail.com",
//         password:"suman@123",
//         age:"29",
//         gender:"male"
//     })
//     try{
//         await user.save()
//         res.send("User addd successfully")
//     }catch(err){
//         res.status(400).send("error saving the users" + err.message)
//     }
// })

app.post('/signup', async (req,res)=>{
    console.log(req.body)
    
    // creating a new instance of the User model
    const user = new User(req.body)
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



