require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const PORT = 8080;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

mongoose
.connect("mongodb://127.0.0.1:27017/blogexdb")
.then((e)=>console.log("connected to db"));

app.get("/",(req,res)=>{
    res.render("home");
})

app.use("/user",userRoutes);

app.listen(PORT,console.log(`server started at port ${PORT}`))