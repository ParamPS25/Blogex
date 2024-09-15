const Blog = require("../models/blog");
const Comment = require("../models/comments");

function getNewBlog(req,res){
    res.render("addBlog.ejs",{
        currentUser: req.user     // also passing currentUser as it contains navbar and navbar contains currentUser obj
    });
}

async function postNewBlog (req,res){
    //console.log(req.file,req.body);
    // if user not uploaded file => err as filename will be undefined
    // so will set caver img path as null so even if req.file is undefined not gives err
    
    coverImagePath = null;
    if(req.file){
        coverImagePath = `/uploads/${req.user._id}/${req.file.filename}`
    }
    const{title,bodyContent}=req.body
    const newBlog = await Blog.create({
        title,
        bodyContent,
        createdBy:req.user._id,                                     
        coverImage: coverImagePath
    });
    res.redirect(`/blog/${newBlog._id}`);
}

// get /blog/blog._id -> /blog/:blogId 

async function getFullBlog(req,res){
    const fullBlog = await Blog.findById(req.params.blogId).populate('createdBy');
    const allComments = await Comment.find({blogId : req.params.blogId}).populate('createdBy')                // finding all comments matching with this blogid and populate it with createdby
    res.render("fullBlog.ejs",{
        currentUser : req.user,                     //to display user info on comment and to load navbar wrt to Current user
        fullBlog : fullBlog,                          // as populated by createdBy can display info about user who posted this blog
        allComments : allComments,                    // passing all comments realted to this blog
    })
}

module.exports ={
    getNewBlog,
    postNewBlog,
    getFullBlog,
}