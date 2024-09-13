const User = require("../models/users");


function handleGetSignup(req,res){
    return res.render("signup.ejs");
}

function handleSignin(req,res){
    return res.render("signin.ejs");
}

async function createAccount(req,res){
    const {username,email,password} = req.body;

    const new_user = await User.create({
        username,
        email,
        password,
    });
    return res.redirect("/"); 
}

async function checkSignin(req,res){
    const{email,password} = req.body;
    const isMatched = await User.matchPassword(email,password);

    if(isMatched != true){
        return res.render("signin.ejs",{
            signInErrMsg:"wrong password or email"
        });
    }
    return res.redirect("/");
}

module.exports = {
    handleGetSignup,
    handleSignin,
    createAccount,
    checkSignin,
}