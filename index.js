require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes")
const cookieParser = require("cookie-parser");
const {validateUserViaCookie} = require("./middlewares/userMiddleware")
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

app.use(validateUserViaCookie("uid"))   
//uid cookie name set on userController

app.get("/",(req,res)=>{
    res.render("home",{
        currentUser : req.user,
    });
})

app.use("/user",userRoutes);
app.use("/blog",blogRoutes);

app.listen(PORT,console.log(`server started at port ${PORT}`))