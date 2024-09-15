const jwt = require("jsonwebtoken");
require("dotenv").config();

function createAccessToken(user){
    const payload = {
        _id : user._id,
        email : user.email,
        password : user.password,
        username : user.username,
        profileImg : user.profileImg,
        role : user.role,
    }
    const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET_KEY);
    return token;
}

function validateToken(token){
    const payload = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY);
    return payload;
}

module.exports ={
    createAccessToken,
    validateToken,
}
