
const express = require("express")
const { validateSignUpData } = require("../utils/validation.js")
const User = require("../models/user")
//const { userAuth } = require("../middleware/auth.js")
const bcrypt = require("bcrypt")
const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    //console.log(req.body)
    try {
        // validation of data
        validateSignUpData(req)

        const { firstName, lastName, emailId, password } = req.body
        // encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)
        //console.log(passwordHash)


        // creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        })
        await user.save()
        res.send("User addd successfully")
    } catch (err) {
        res.status(400).send("error saving the users" + err.message)
    }
})


authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("invalid credentials");
        }
        const isPasswordVaild = await user.validatePassword(password)
        if (isPasswordVaild) {
            // crreate JWT token

            const token = await user.getJWT()
           // console.log(token)
            // add the token to cookie and send the response back to the user

            res.cookie("token", token,{
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.send("Login Successful !")
        } else {
            throw new Error("invalid credentials");

        }


    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

authRouter.post("/logout", async (req,res) =>{
   res.cookie("token", null, {
    expires : new Date(Date.now())
   })
   res.send("logout successfully")
})

module.exports = authRouter