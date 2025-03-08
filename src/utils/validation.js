const validator = require("validator")

const validateSignUpData = (req) =>{
    const {firstName,lastName,emailId,password} = req.body

    if(! firstName || !lastName){
        throw new Error (" : name is not valid");
        
    }else if(!validator.isEmail(emailId)) {
        throw new Error (" : not valid email")
    }else if(!validator.isStrongPassword(password)) {
        throw new Error(" : enter strong password");
        
    }
}



const validateEditProfileData = (req) =>{
    const allowEditFileds = [
        "firstName", 
        "lastName",
        "emailId",
        "gender",
        "skill",
        "about",
        "photoUrl"
    ]  
    const isEditAllowed = Object.keys(req.body).every((filed) => 
        allowEditFileds.includes(filed) // Explicit return
    );
    return isEditAllowed;
};


module.exports = {validateSignUpData, validateEditProfileData}