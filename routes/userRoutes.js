const express = require("express");
const{createAccount,handleGetSignup,handleSignin} = require("../controllers/userController");

const router = express.Router();

router.get('/signup',handleGetSignup);
router.post('/signup',createAccount);
router.get('signin',handleSignin);

module.exports = router;
