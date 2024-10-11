const{createHmac,randomBytes} =require("crypto");
const mongoose = require("mongoose");
const{createAccessToken,validateToken} = require("../services/authentication");

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
        default : "/images/profileDefault.jpeg"
    },
    BlogsWritten : [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'blogs' 
    }],
    // loginAttempts : {
    //     type : Number,
    //     default : 0,
    // },
    // lockUntill : {
    //     type : Date,
    //     default: undefined
    // }
    
},{timestamps:true}
);

// set up a pre-save middleware function that runs before a user document is saved to the database
userSchema.pre("save",function(next){
    const user = this;

    if(!user.isModified("password")) return;     //checks if the password field has been modified if not return

    const Salt = randomBytes(16).toString("hex");

    const hasedPassword = createHmac("sha256",Salt)
    .update(user.password)                     //Updates the Hmac content with the given data
    .digest("hex")                             //encodes in hex

    // update current user object
    this.salt = Salt
    this.password = hasedPassword;

    next();
})

userSchema.static("matchPasswordAndCreateToken",async function(givenEmail,givenPassword){
    const user = await this.findOne({ email: givenEmail });
   
    if (!user) throw new Error("user not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(givenPassword)
        .digest("hex");

    if (hashedPassword !== userProvidedHash){
        throw new Error("incorrect password");
    }
    const token = createAccessToken(user);
     return token;
})


// userSchema.static("incrementLoginAttempts",async function(email) {
//     const lockTime = 15 * 60 * 1000; // 15 mins lock time

//     console.log("Finding user by email:", email);
//     // Find the user by email
//     const user = await this.findOne({ email });

//     if (!user) {
//         console.error("User not found for incrementing login attempts.");
//         return; 
//     }

//     console.log("User found. Checking lock status.");
//     // Return if the account is locked, ensuring the calling function can handle it immediately
//     if (user.lockUntill && user.lockUntill > Date.now()) {
//         console.log("Account is locked until:", user.lockUntill);
//         throw new Error('exceeds more than 5 tries, try again later');
//     }

//     console.log("Incrementing login attempts.");
//     // If the account isn't locked, increment the counter and return the result of this.save(), which is a promise
//     if (user.loginAttempts >= 5) {
//         user.lockUntill = Date.now() + lockTime;  // Locking account until 15 mins from last (5th) attempt
//         user.loginAttempts = 0;
//     } else {
//         user.loginAttempts += 1;
//     }

//     console.log("Saving user with incremented login attempts.");
//     return await user.save();
// });


const User = mongoose.model("users",userSchema);

module.exports = User;