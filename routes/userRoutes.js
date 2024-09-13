const express = require("express");
const{createAccount,handleGetSignup,handleSignin,checkSignin} = require("../controllers/userController");

const router = express.Router();

router.get('/signup',handleGetSignup);
router.post('/signup',createAccount);

router.get('/signin',handleSignin);
router.post('/signin',checkSignin);

module.exports = router;
