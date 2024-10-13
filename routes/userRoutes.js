const express = require("express");
const{createAccount,handleGetSignup,handleSignin,checkSignin,handleLogout,getSelectedUserBlog,getOtpVerification,postOtpVerification} = require("../controllers/userController");
const {authSignUp} = require("../middlewares/userMiddleware");

const router = express.Router();

router.get('/signup',authSignUp,handleGetSignup);
router.post('/signup',createAccount);
router.get('/otp-verify',getOtpVerification);
router.post('/otp-verify',postOtpVerification);

router.get('/signin',handleSignin);
router.post('/signin',checkSignin);

router.get('/logout',handleLogout);
// router.get('/list-user',listOutUser);

router.get('/:userId',getSelectedUserBlog);

module.exports = router;