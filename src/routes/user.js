const express = require("express")
const { userAuth } = require("../middleware/auth")
const ConnectionRequestModel = require("../models/connectionRequest")
const user = require("../models/user")
const userRouter = express.Router()

// get all pending connection request for loggedIn User
userRouter.get("/user/request/received",userAuth,async (req,res) => {
    try {
        const loggedInUser = req.user
       

          
       const connectionRequest = await ConnectionRequestModel.find({
           toUserId : loggedInUser._id,
           status : "interested"
       }).populate("fromUserId", "firstName lastName photoUrl")
       res.json({message:"data featched sucessfully",data:connectionRequest})
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

userRouter.get("/user/connection",userAuth,async (req,res) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequestModel.find({
            $or :[
                {toUserId : loggedInUser._id , status: "accepted"},
                {fromUserId : loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", "firstName lastName photoUrl")

        const data = connectionRequest.map((row) => row.fromUserId )
        res.send({data})
    } catch (err) {
        res.status(400).send({message:"ERROR : " + err.message})
        
    }
})

module.exports = userRouter