
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





// --- Route Definitions ---
// profileRouter.patch("/profile/edit", userAuth, upload.single('photo'), async (req, res) => {
//     try {
//         const loggedInUser = req.user;

//         // Handle profile data updates
//         Object.keys(req.body).forEach((key) => {
//             if (key !== 'photoUrl') {
//                 loggedInUser[key] = req.body[key];
//             }
//         });

//         // Handle file upload or URL
//         if (req.file) {
//             loggedInUser.photo = `/uploads/${req.file.filename}`;
//         } else if (req.body.photoUrl) {
//             loggedInUser.photo = req.body.photoUrl;
//         }

//         await loggedInUser.save();

//         res.json({
//             message: `${loggedInUser.firstName} profile updated successfully`,
//             data: loggedInUser,
//         });
//     } catch (err) {
//         res.status(400).send("ERROR: " + err.message);
//     }
// });



// forgot password APIs
profileRouter.patch("/profile/password" , async (req,res) =>{
 
})

module.exports = profileRouter