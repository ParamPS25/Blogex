const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
    },
    bodyContent:{
        type:String,
    },
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    totalViews:{
        type : Number,
        default : 0,
    },
    upvotes:{
        type : Number,
        default : 0,
    },
    upvotedBy:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
    }]
    // arr of upvotedBy as one blog can recive multiple upvotes by user(unique) 
},{timestamps:true}
);

const Blog = mongoose.model("blogs",blogSchema);

module.exports = Blog;