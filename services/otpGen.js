const otpGenerator = require("otp-generator");

function generateOtp(){
    const OTP = otpGenerator.generate(5,{
        upperCaseAlphabets : false,
        specialChars : false,
    })
    return OTP;
}

module.exports = {
    generateOtp,
}