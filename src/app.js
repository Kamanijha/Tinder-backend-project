const express = require("express")

const app = express()

app.use("/",(req,res)=>{
    res.send('hello hello hello')
})

app.use("/jha",(req,res)=>{
    res.send('hello hello hello')
})

app.use("/test",(req,res)=>{
    res.send('test test test')
})

app.use((req,res)=>{
    res.send('hello from server')
})
app.listen(7777,()=>{
    console.log("start server on 7777")
})

//console.log(app)