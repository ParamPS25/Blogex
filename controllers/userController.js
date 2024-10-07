require("dotenv").config();
const User = require("../models/users");
const nodemailer = require("nodemailer");
const {nodemailerAuth} = require("../services/nodemailerAuth");

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
        // welcome mail to new user 
        const transporter = nodemailerAuth;

        await transporter.sendMail({
            from : "bhavsarparam1941@gmail.com",
            to : new_user.email,
            subject : "Welcome to BlogEx!",
            text : `Hi,${new_user.username}, We're thrilled to have you join our community of passionate bloggers and readers.`,
            html : "<h4>If you have any questions or need assistance, feel free to reach out to us at support@blogex.com. We're here to help!</h4> <h4> Happy blogging!</h4> <br> <p>Best regards,</p><p>The BlogEx Team</p>"
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

// async function listOutUser(req,res){
//     const allUsers = await User.find({});
//     res.status(200).json(allUsers);
// }

async function getSelectedUserBlog(req,res){
    const selectedUser = await User.findById(req.params.userId).populate('BlogsWritten');
    //console.log(selectedUser);
    res.render('userBlogs.ejs',{
        userBlogs : selectedUser
    })
}

module.exports = {
    handleGetSignup,
    handleSignin,
    createAccount,
    checkSignin,
    handleLogout,
    //listOutUser,
    getSelectedUserBlog,
}

//Port 465: This port is used for SMTPS (SMTP Secure), which means it uses SSL (Secure Sockets Layer) to encrypt the connection between your application and the email server. This ensures that the data transmitted is secure and protected from eavesdropping
//Service: Specifies the email service provider (Gmail in this case).
//Secure: When set to true, it indicates that the connection should use SSL/TLS.
//Port 465: Used for SMTPS, ensuring a secure connection.