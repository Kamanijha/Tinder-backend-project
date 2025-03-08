
const express = require("express")
const requestRouter = express.Router()
const { userAuth } = require("../middleware/auth.js")
const ConnectionRequestModel = require("../models/connectionRequest.js")
const User = require("../models/user.js")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status
         

        // validation for only ignored and interested
        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type : " + status })
        }

        // validation for user found in db or not
       const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(400).send("user not found")
        }
       



        // if there is an existing connectionRequest
        // const exictingRequest = await ConnectionRequestModel.findOne({
        //     $or: [
        //         { fromUserId, toUserId, },
        //         { fromUserId: toUserId, toUserId: fromUserId }
        //     ]
        // })
        // if(exictingRequest){
        //     return res.status(400).send({message:"already send request"})
        // }


        //prevent self request
        if(fromUserId == toUserId){
            return res.status(400).send("self request not allowed")
        }

        //prevent duplicate request
        const exictingRequest = await ConnectionRequestModel.findOne({
            fromUserId,
            toUserId
        })
         if(exictingRequest){
            return res.status(400).send("already send request")
         }
        //prevent reverse request
        const reverseRequest = await ConnectionRequestModel.findOne({
            fromUserId :toUserId,
            toUserId : fromUserId
        })
        if(reverseRequest){
            return res.status(400).send("reverse request not allowed")
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save()

        res.json({
            message: req.user.firstName + " is "+ status + " to " + toUser.firstName,
            data
        })

    } catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }
})

module.exports = requestRouter