const express = require("express")
const connectDB = require("./config/database.js")
const { validateSignUpData } = require("./utils/validation.js")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { userAuth } = require("./middleware/auth.js")
const app = express()
const User = require("./models/user")
const { now } = require("mongoose")
// express middleware 
app.use(express.json())
app.use(cookieParser())
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



app.post('/signup', async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {
       
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

app.post("/sendConnectionRequest",userAuth,async (req,res) =>{
    const user = req.user
    console.log("sending the connection request")

    res.send(user.firstName + ": sending connection request")
})

// get user from database using email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId
    try {
        const users = await User.find({ emailId: userEmail })
        if (users.length === 0) {
            res.status(404).send("user not found")
        } else {
            res.send(users)
        }
    } catch (err) {
        res.status(400).send("something went wrong")
    }
})


// feed api - GET/feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(400).send("something went wrong")
    }
})

// delete user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    console.log(userId)
    try {
        const users = await User.findByIdAndDelete({ _id: userId })
        //const users = await User.findByIdAndDelete(userId)
        console.log(users)
        res.send("deleted sucessfully")
    } catch (err) {
        res.status(400).send("something went wrong")
    }
})

// update the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    const data = req.body
    console.log(data)
    try {

        const UPDATE_ALLOWED = [
            "firstName",
            "profile",
            "lastName",
            "gender",
            "skill"
        ]
        const isUpdateAllowed = Object.keys(data).every((k) =>
            UPDATE_ALLOWED.includes(k)
        )
        if (!isUpdateAllowed) {
            throw new Error("udate is not allowed");

        }
        if (data?.skill.length > 10) {
            throw new Error("can not add skill more then 10");

        }

        const users = await User.findByIdAndUpdate(userId, data)
        res.send("update sucessfully")
    } catch (err) {
        res.status(400).send("UPDATE_FAILED", err.message)
    }
})

app.put("/user", async (req, res) => {
    const userId = req.body.userId
    const data = req.body
    try {
        const users = await User.findByIdAndUpdate(userId, data)
        res.send("update sucessfully")
    } catch (err) {
        res.status(400).send("something went wrong")
    }
})

//  first connect to  database and then app.listen
connectDB().then(() => {
    console.log("database connected successfully...")
    app.listen(7777, () => {
        console.log("start server on 7777")
    })
}).catch(err => {
    console.error('database connot connect ', err.message)
})



