const express = require("express");
const Comment = require("../models/comments");

const router = express.Router();

// /blog/comment/:blogid
router.post('/:blogId',async(req,res)=>{
    await Comment.create({
        commentContent: req.body.commentContent,
        blogId : req.params.blogId,
        createdBy : req.user._id,
    })

    res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;