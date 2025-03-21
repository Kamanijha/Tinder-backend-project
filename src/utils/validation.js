const validator = require("validator")

const validateSignUpData = (req) =>{
    const {firstName,lastName,emailId,password,age,gender} = req.body

    if(! firstName || !lastName){
        throw new Error (" : name is not valid");
        
    }else if(!validator.isEmail(emailId)) {
        throw new Error (" : not valid email")
    }else if(!validator.isStrongPassword(password)) {
        throw new Error(" : enter strong password");
        
    }else if ( !validator.isInt(age.toString(), { min: 1, max: 99 })) {
        throw new Error("enter valid age");
    }else if (!gender || !validator.isIn(gender, ["male", "female", "other"])) {
        throw new Error("Gender must be 'male', 'female', or 'other'.");
    }
}



const validateEditProfileData = (req) =>{
    const allowEditFileds = [
        "firstName", 
        "lastName",
        "emailId",
        "gender",
        "age",
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