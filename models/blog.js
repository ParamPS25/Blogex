const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    coverImg:{
        type:String,
        default: "/images/default.jpeg"
    },
    bodyContent:{
        type:String,
    },
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"users",
    }
},{timestamps:true}
);

const Blog = mongoose.model("blogs",blogSchema);

module.exports = Blog;