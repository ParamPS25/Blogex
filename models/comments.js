const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentContent : {
        type : String,
        required : true,
    },
    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"blogs",
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"users",
    }
},{timestamps:true}
);

const Comment = mongoose.model("comments",commentSchema);

module.exports = Comment