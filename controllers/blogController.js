const Blog = require("../models/blog");

function createNewBlog(req,res){
    res.render("addBlog.ejs",{
        currentUser: req.user     // also passing currentUser as it contains navbar and navbar contains currentUser obj
    });
}
 function postNewBlog(req,res){
    
    return res.redirect("/")
 }


module.exports ={
    createNewBlog,
    postNewBlog,
}