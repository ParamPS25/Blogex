require("dotenv").config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes")

const {validateUserViaCookie} = require("./middlewares/userMiddleware")
const  Blog  = require("./models/blog");
const User = require("./models/users")
const path = require("path");
const rateLimit = require("express-rate-limit");


const PORT = process.env.PORT || 8000;

const app = express();

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

mongoose
.connect(process.env.MONGO_URL)
.then((e)=>console.log("connected to db"));

const limiter = rateLimit({
    windowMs : 1* 60 * 1000,    //1 min
    max : 100,                  // max of 100 req in 1 min
    message : 'too many requests from this ip , please try again after some-time',
    headers : true , // send rate limit info in headers
});

app.use(limiter); //Limits the number of requests from a single IP address to prevent abuse
//Protects your application from brute-force attacks.

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
// Serve static files from the 'public' directory
app.use(express.static(path.resolve("./public")));

app.use(validateUserViaCookie("uid"))   
//uid cookie name set on userController

app.get("/",async(req,res)=>{

    try{
        const page = parseInt(req.query.page) || 1 ;        // default 1st page
        const limit = parseInt(req.query.limit) || 2;       // default limit of 2 
        const skip = (page-1)*limit;

        const totalBlogs = await Blog.countDocuments({});
        const totalPages = Math.ceil(totalBlogs/limit);     // to count total page 

        const allBlogs = await Blog.find({}).populate("createdBy").skip(skip).limit(limit);
        const allUsers = await User.find({})
        res.render("home",{
            currentUser : req.user,
            allBlogs : allBlogs,
            allUsers : allUsers,
            currentPage : page,
            totalPages : totalPages,
            hasNextPage : page < totalPages,        // if current page < totalPages available then nextPage exist
            hasPrevPage : page > 1                  // lly, for prevPage if currentpage number is atleast > 1 
    });
    }catch(err){
        console.error(err);
        res.status(500)
    }
})

app.use("/user",userRoutes);
app.use("/blog",blogRoutes);
app.use("/blog/comment",commentRoutes)

app.listen(PORT,console.log(`server started at port ${PORT}`))