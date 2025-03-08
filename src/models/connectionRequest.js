const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["ignored","interested","accepted","rejected"],
        message:`{VALUE} is not supported`
    },
},{timestamps:true})

// index toUserId and fromUserId to prevent duplicate request
connectionRequestSchema.index({toUserId:1,fromUserId:1},{unique:true})

// prevent self request
// connectionRequestSchema.pre("save",function (req,res,next){
//     const connectionRequest = this
//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error("connot send connection request to yourself");
        
//     }
//     next()
// })



const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequestModel