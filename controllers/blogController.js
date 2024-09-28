const Blog = require("../models/blog");
const Comment = require("../models/comments");
const QrCode = require("qrcode");

require("dotenv").config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const upviews = fullBlog.totalViews + 1;
    await Blog.updateOne({_id:req.params.blogId},{$set:{totalViews:upviews}});

    res.render("fullBlog.ejs",{
        currentUser : req.user,                     //to display user info on comment and to load navbar wrt to Current user
        fullBlog : fullBlog,                          // as populated by createdBy can display info about user who posted this blog
        allComments : allComments,                    // passing all comments realted to this blog
        blogViews : upviews,
        // upvotes : req.upvotes,
    })
}

// /blog/blog._id/aiSummary
async function postAiSummary(req,res){
    const findBlog = await Blog.findById(req.params.blogId);
    const prompt = `summerise this ${findBlog.bodyContent}`;
    const maxTokens = 100;
    const result = await model.generateContent(prompt,maxTokens);
    aiGenContent = result.response.text();
      // Remove all asterisks from the content
    aiGenContent = aiGenContent.replace(/\*/g, '');

    // Trim any leading or trailing whitespace
    aiGenContent = aiGenContent.trim();

     await res.render("aiContent.ejs",{
        aiGenContent:aiGenContent,
    });
}

async function deleteBlog(req,res){
    try{
        const blog = await Blog.findById(req.params.blogId).populate("createdBy")
        if(req.user.username === blog.createdBy.username || req.user.role === "ADMIN"){
        await Blog.findByIdAndDelete(req.params.blogId);
        res.redirect("/");
        }
    }catch(e){
        res.redirect("/");
    }
}

async function FormQrCode(req,res){
    try{
        const domain = req.protocol + '://' + req.get('host');
        const url = `${domain}/blog/${req.params.blogId}`;
            // const url = `/blog/${req.params.blogId}`;
            QrCode.toDataURL(url,(err,qrCodeUrl)=>{
                if(err){
                    res.status(500).json("internal server err");
                }
                else{
                    //console.log(qrCodeUrl)
                    res.render("QR.ejs",{
                        qrCodeUrl : qrCodeUrl,
                    })
                }
            })
    }catch(err){
        console.log(err);
    }
}

// async function postUpvotes(req,res) {
//    try{ 
//         const blog = await Blog.findById(req.params.blogId);
//         const updatedUpvotes = blog.upvotes + 1;
//         req.upvotes = await Blog.updateOne({_id:req.params.blogId},{$set:{upvotes:updatedUpvotes}});
//         res.redirect(`/`);
//     }
//     catch(err){
//         console.log(err);
//     }
// }

module.exports ={
    getNewBlog,
    postNewBlog,
    getFullBlog,
    postAiSummary,
    deleteBlog,
    // postUpvotes
    FormQrCode
}

//When you generate a QR code using a relative URL like /blog/${req.params.blogId}, the QR code only contains the path part of the URL. 
//This means it doesn’t include the domain name (e.g., https://yourdomain.com).
//As a result, when you scan the QR code, it tries to navigate to /blog/blogid on the current domain, which might not be correct, especially after deployment.

