const { validateToken } = require("../services/authentication");

// checking for jwt access token
function validateUserViaCookie(cookieName){
    
    return (req,res,next) =>{
    const token = req.cookies[cookieName];                  // req cookie-parser so npm 
    if(!token){
        return next();     // next without adding req.user property if token null
    }
    try{
        const userPayload = validateToken(token)
        req.user = userPayload;                     //adding req.user prop if token validated
    }
    catch(err){}

    return next();             // if token not validated next without adding prop
    };
}

module.exports = {validateUserViaCookie}