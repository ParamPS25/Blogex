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
const path = require("path");

const PORT = 8080;

const app = express();

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

mongoose
.connect("mongodb://127.0.0.1:27017/blogexdb")
.then((e)=>console.log("connected to db"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
// Serve static files from the 'public' directory
app.use(express.static(path.resolve("./public")));

app.use(validateUserViaCookie("uid"))   
//uid cookie name set on userController

app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({}).populate("createdBy");
    res.render("home",{
        currentUser : req.user,
        allBlogs : allBlogs,
    });
})

app.use("/user",userRoutes);
app.use("/blog",blogRoutes);
app.use("/blog/comment",commentRoutes)

app.listen(PORT,console.log(`server started at port ${PORT}`))