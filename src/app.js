const express = require("express")

const app = express()

app.use("/",(req,res,next)=>{
    //res.send("handling / route")
    next()
})

app.get(
"/user",
(req,res,next)=>{
    console.log("handling the route user1")
    next()
    //res.send("router handler")
},(req,res,next)=>{
    console.log("handling the route user2")
    res.send("router handler 2nd")
    
}

)

app.listen(7777,()=>{
    console.log("start server on 7777")
})

