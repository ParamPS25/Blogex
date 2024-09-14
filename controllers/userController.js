const User = require("../models/users");


function handleGetSignup(req,res){
    return res.render("signup.ejs");
}

function handleSignin(req,res){
    return res.render("signin.ejs");
}

//on logout clear cookie and redirect to /
function handleLogout(req,res){
    return res.clearCookie("uid").redirect("/");
}

async function createAccount(req, res) {
    try {
        const { username, email, password } = req.body;
        const new_user = await User.create({
            username,
            email,
            password,
        });
        return res.redirect("/"); 
    } catch (error) {
        console.error("Error creating account:", error);
        if (!res.headersSent) {
            return res.status(500).send("Internal Server Error");
        }
    }
}


async function checkSignin(req,res){
    const{email,password} = req.body;

    try{
    const token = await User.matchPasswordAndCreateToken(email,password); //
    return res.cookie("uid",token).redirect("/");     // 
    }
    catch(e){
        res.render("signin.ejs",
        {
            signInErrMsg:"invalid username or password"
        })
    }
}

module.exports = {
    handleGetSignup,
    handleSignin,
    createAccount,
    checkSignin,
    handleLogout,
}