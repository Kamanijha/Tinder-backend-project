const express = require("express")

const app = express()
const {adminAuth,userAuth}= require("./middleware/auth")
 // Handle auth midlleware for all GET,POST....  request

app.use("/admin",adminAuth)
//app.use("/user",userAuth)

app.post("/user/login",(req,res)=>{
    res.send("user logged sucessfully")
})

app.get("/user",userAuth,(req,res)=>{
   res.send("user data sent")
})

app.get("/admin/getAllData",(req,res) =>{
        res.send("all data is sent")
    
})


app.get("/admin/DeleteData",(req,res) =>{
    res.send("all data deleted")
})

app.listen(7777,()=>{
    console.log("start server on 7777")
})

