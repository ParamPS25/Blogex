require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes")
const cookieParser = require("cookie-parser");
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
    const allBlogs = await Blog.find({});
    res.render("home",{
        currentUser : req.user,
        allBlogs : allBlogs,
    });
})

app.use("/user",userRoutes);
app.use("/blog",blogRoutes);

app.listen(PORT,console.log(`server started at port ${PORT}`))