const{createHmac,randomBytes} =require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    salt : {
        type : String,
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ["USER","ADMIN"],
        default : "USER",
    },
    profileImg : {
        type : String,
        default : "/images/default.jpeg"
    }
},{timestamps:true}
);

// set up a pre-save middleware function that runs before a user document is saved to the database
userSchema.pre("save",function(next){
    const user = this;

    if(!user.isModified("password")) return;     //checks if the password field has been modified if not return

    const Salt = randomBytes(16).toString();

    const hasedPassword = createHmac("sha256",Salt)
    .update(user.password)                     //Updates the Hmac content with the given data
    .digest("hex")                             //encodes in hex

    // update current user object
    this.salt = Salt
    this.password = hasedPassword;

    next();
})

const User = mongoose.model("users",userSchema);

module.exports = User;