const mongoose = require("mongoose")
const validator = require("validator")
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
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender is not valid");
                
            }
        }
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
//userSchema.index({ emailId: 1 }, { unique: true });
userSchema.pre("save", async function (next) {
    // ✅ Correct way to check duplicate email
    const existingUser = await this.constructor.findOne({ emailId: this.emailId });

    if (existingUser) {
        return next(new Error("Email already exists!")); // Reject duplicate email
    }
    next();
});



 const userModel = mongoose.model("user",userSchema)
 module.exports = userModel
//module.exports = mongoose.model("User",userSchema)