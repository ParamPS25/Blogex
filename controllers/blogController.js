const Blog = require("../models/blog");

function getNewBlog(req,res){
    res.render("addBlog.ejs",{
        currentUser: req.user     // also passing currentUser as it contains navbar and navbar contains currentUser obj
    });
}

async function postNewBlog (req,res){
    //console.log(req.file,req.body);
    const{title,bodyContent}=req.body
    const newBlog = await Blog.create({
        title,
        bodyContent,
        createdBy:req.user._id,                                     //
        coverImage:`/uploads/${req.user._id}/${req.file.filename}`
    });
    res.redirect(`/blog/${newBlog._id}`);
}

// get /blog/blog._id -> /blog/:id
async function getFullBlog(req,res){
    const fullBlog = await Blog.findById(req.params.id);
    res.render("fullBlog.ejs",{
        currentUser : req.user,                     //to display user info on blog and to load navbar wrt to user
        fullBlog:fullBlog,
    })
}

module.exports ={
    getNewBlog,
    postNewBlog,
    getFullBlog,
}