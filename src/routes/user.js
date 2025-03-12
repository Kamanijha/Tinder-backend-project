const express = require("express")
const { userAuth } = require("../middleware/auth")
const ConnectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user")
const user = require("../models/user")
const userRouter = express.Router()

const USER_SAVE_DATA = "firstName lastName  photoUrl about skill "

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
        }).populate("fromUserId", "firstName lastName photoUrl").populate("toUserId", "firstName lastName photoUrl")

         const data = connectionRequest.map((row) =>{
            if(row.fromUserId.equals(loggedInUser._id)){
                return row.toUserId
            }
            return row.fromUserId
         })
        res.json({data})
    } catch (err) {
        res.status(400).send({message:"ERROR : " + err.message})
        
    }
})



// todo : 
// user should see all the users card except 
// his own card
// his connectiion
// ignored people
// already sent connection request
userRouter.get("/feed",userAuth,async (req,res) => {

   try {
    const loggedInUser = req.user

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit



    // find all user
    const connectionRequest = await ConnectionRequestModel.find({
        $or : [
            {fromUserId : loggedInUser._id},
            {toUserId : loggedInUser._id}
        ]
    }).select("fromUserId toUserId")

    const hideUserFromFeed = new Set()
    connectionRequest.forEach((request) => {
        hideUserFromFeed.add(request.fromUserId.toString())
        hideUserFromFeed.add(request.toUserId.toString())
    })
    // console.log(hideUserFromFeed)

     const users = await User.find({
        $and : [
            {_id : {$nin : Array.from(hideUserFromFeed)}},
            {_id : {$ne : loggedInUser._id}}
        ]
     }).select(USER_SAVE_DATA).skip(skip).limit(limit)
     res.json({data : users})

   } catch (err) {
      res.status(400).send("ERROR : " + err.message)
   }
    
})


module.exports = userRouter