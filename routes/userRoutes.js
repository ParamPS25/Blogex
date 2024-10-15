const express = require("express");
const{handlePostSignupAndOtp,handleGetSignup,handleSignin,checkSignin,handleLogout,getSelectedUserBlog,getOtpVerification,postOtpVerification} = require("../controllers/userController");
const {authSignUp} = require("../middlewares/userMiddleware");

const router = express.Router();

// session to temp store user , accountcreatedflag and otp
const session = require("express-session");
router.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: { 
        maxAge: 10 * 60 * 1000 // Session timeout set to 10 minutes 
    }
}));

router.get('/signup',authSignUp,handleGetSignup);
router.post('/signup',handlePostSignupAndOtp);
router.get('/otp-verify',getOtpVerification);
router.post('/otp-verify',postOtpVerification);

router.get('/signin',handleSignin);
router.post('/signin',checkSignin);

router.get('/logout',handleLogout);
// router.get('/list-user',listOutUser);

router.get('/:userId',getSelectedUserBlog);

module.exports = router;