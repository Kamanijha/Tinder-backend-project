const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        lowercase:true,
        trim:true,
        required:true,
        unique:true,
        validate:{
            validator:function(value){
                return validator.isURL(value)
            },
            message:"invalid photo url"
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate: {
            validator(value) {
                return /^(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value);
            },
            message: "password should be strong"
        }
        
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        enum: {
            values: ["male","female","other"],
            message: `{VALUE} is not supported`
        }
        // validate(value){
        //     if(!["male","female","other"].includes(value)){
        //         throw new Error("gender is not valid");
                
        //     }
        // }
    },
    photoUrl:{
        type:String,
        default:"https://www.freeiconspng.com/images/profile-icon-png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid PHOTO  URL");
                
            }
        }
    },
    profile:{
      type:String,
      
    },
    about:{
       type:String,
       default:"about this users "
    },
    skill:{
        type:[String]
    }
},{timestamps:true})

// duplicate email handler function


userSchema.pre("save", async function (next) {
    if (this.isModified("emailId")) { // Run check only if email is modified
        const existingUser = await this.constructor.findOne({ emailId: this.emailId });
        if (existingUser) {
            return next(new Error("Email already exists!")); 
        }
    }
    next();
});



userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id }, "Tinder@123$456",{expiresIn : "7d"})

    return token
}

userSchema.methods.validatePassword = async function (userInputPassword){
    const user = this
    const passwordHash = user.password
    
    const isPasswordVaild = await bcrypt.compare(userInputPassword,passwordHash )

    return isPasswordVaild
}

//  const userModel = mongoose.model("user",userSchema)
//  module.exports = userModel
module.exports = mongoose.model("User",userSchema)