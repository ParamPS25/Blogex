require("dotenv").config();
const User = require("../models/users");
const nodemailer = require("nodemailer");
const {nodemailerAuth} = require("../services/nodemailerAuth");
const {generateOtp} = require("../services/otpGen");

// session created in user routerto temp store user , accountcreatedflag and otp

function handleGetSignup(req,res){
    return res.render("signup.ejs",{
        signupErrMsg : null,
    });
}

function handleSignin(req,res){
    return res.render("signin.ejs");
}

//on logout clear cookie and redirect to /
function handleLogout(req,res){
    return res.clearCookie("uid").redirect("/");
}

async function handlePostSignupAndOtp(req, res) {
    try {
        const { username, email, password } = req.body;
        const checkemail = await User.findOne({email:email});
        // if user already exists with this mail account => again render signup
        if(checkemail){
            return res.render("signup.ejs",{
                signupErrMsg : "user already exists with this email"
            })
        }
        // Temporarily store user details in session to create after otp verification
        req.session.tempUser = { username, email, password }

        // const new_user = await User.create({
        //     username,
        //     email,
        //     password,
        // });

        const otp = generateOtp();
         req.session.GeneratedOtp = otp; 

        // welcome mail to user with otp
        const transporter = nodemailerAuth;

        await transporter.sendMail({
            from : "bhavsarparam1941@gmail.com",
            to : req.body.email,
            subject : "Welcome to BlogEx!",
            html : `<h4>We're thrilled to have you join our community of passionate bloggers and readers.</h4>,
                    <h4>your one time otp is : ${otp}</h4>
                    <h4>If you have any questions or need assistance, feel free to reach out to us at support@blogex.com. We're here to help!</h4> <h4> Happy blogging!</h4> <br> <p>Best regards,</p><p>The BlogEx Team</p>`
        });

        req.session.accountCreatedFlag = true;      // to ensure otp page accesible only to user who currently created account only restricting anon access 
        return res.redirect("/user/otp-verify");

    } catch (error) {
        console.error("Error creating account:", error);
        if (!res.headersSent) {
            return res.status(500).send("Internal Server Error");
        }
    }
}

async function getOtpVerification(req,res){
    res.render('otpVerification.ejs',{
        currentUser : req.session.tempUser,
        accountCreatedFlag : req.session.accountCreatedFlag,
        otpErrMsg : null,
    });
}

async function postOtpVerification(req,res) {
    try{
        const otpFromUser = req.body.OTP;
        //console.log(req.session)            //look at end of code for debugging purpose

        if(otpFromUser === req.session.GeneratedOtp  && req.session.accountCreatedFlag){
            req.session.accountCreatedFlag = false;    // to restrict anon accessing otp page
            // creating new user on successfully otp verifn
            const new_user = await User.create(req.session.tempUser);            
            
            // Clear the session data after successful verification and user creation
            req.session.generatedOtp = null;
            req.session.accountCreatedFlag = null;
            req.session.tempUser = null;

            //console.log(req.session)
            return res.redirect("/");
            
        }
        else{
            // as clearing session data on successfull verifn of otp, else will not create account untill verfn sucess
            return res.render("otpVerification.ejs",{
                otpErrMsg : "Wrong Otp , try again",
                accountCreatedFlag: req.session.accountCreatedFlag,
            })
        }
        // need to set timeout and interval for otp
    }
    catch(e){
        res.status(500)
        console.log(e.message);
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
    });
}

module.exports = {
    handleGetSignup,
    handleSignin,
    handlePostSignupAndOtp,
    checkSignin,
    handleLogout,
    //listOutUser,
    getSelectedUserBlog,
    getOtpVerification,
    postOtpVerification,
}

//Port 465: This port is used for SMTPS (SMTP Secure), which means it uses SSL (Secure Sockets Layer) to encrypt the connection between your application and the email server. This ensures that the data transmitted is secure and protected from eavesdropping
//Service: Specifies the email service provider (Gmail in this case).
//Secure: When set to true, it indicates that the connection should use SSL/TLS.
//Port 465: Used for SMTPS, ensuring a secure connection.



// Session {
//     cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
//     tempUser: {
//       username: 'param2',
//       email: 'bhavsarparam1941@gmail.com',
//       password: '******'
//     },
//     GeneratedOtp: 'fdb5h',
//     accountCreatedFlag: true
//   }

// after successfull verification

// Session {
//     cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
//     tempUser: {
//       username: 'param2',
//       email: 'bhavsarparam1941@gmail.com',
//       password: '********'
//     },
//     GeneratedOtp: 'fdb5h',
//     accountCreatedFlag: true
//   }