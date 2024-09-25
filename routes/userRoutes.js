const express = require("express");
const{createAccount,handleGetSignup,handleSignin,checkSignin,handleLogout} = require("../controllers/userController");
const {authSignUp} = require("../middlewares/userMiddleware");

const router = express.Router();

router.get('/signup',authSignUp,handleGetSignup);
router.post('/signup',createAccount);

router.get('/signin',handleSignin);
router.post('/signin',checkSignin);

router.get('/logout',handleLogout);

module.exports = router;