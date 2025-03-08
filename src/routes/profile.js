
const express = require("express")
const { userAuth } = require("../middleware/auth.js")
const {validateEditProfileData} = require("../utils/validation.js")
const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
       
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

profileRouter.patch("/profile/edit",userAuth, async (req,res) =>{
    try {
        if(!validateEditProfileData(req)){
            throw new Error("invalid edit request");
            //res.status(400).send()
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key]; // Correct assignment
        });
        
        await loggedInUser.save()
        res.json({message:`${loggedInUser.firstName} profile update sucessfully`,data:loggedInUser})
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }

})

// forgot password APIs
profileRouter.patch("/profile/password" , async (req,res) =>{
 
})

module.exports = profileRouter