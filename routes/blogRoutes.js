const express = require("express");
const Blog = require("../models/blog");
const fs = require("fs");
const {getNewBlog,postNewBlog,getFullBlog} = require("../controllers/blogController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

router.get('/add-new',getNewBlog); // /blog/add-new

 // setting up disk storage destination and file name
 const storage = multer.diskStorage({
    destination: function (req,file,cb){
        // Define the path to the user's directory
        const userDir = path.join('./public/uploads', req.user._id);

        // Create the directory if it doesn't exist so each user can have seprate folder of their uploaded img
        fs.mkdirSync(userDir, { recursive: true })
        cb(null, userDir)
    },
    filename: function(req,file,cb){
        const fileName =`${Date.now()}-${file.originalname}`
        cb(null,fileName)
    }
})
// upload instance of multer with specified destination
const upload = multer({storage:storage});


// verify that same name is used for input type file coverImage
router.post('/',upload.single("coverImage"),postNewBlog)  // /blog/
    //console.log(req.file,req.body);

// to read full blog /blog/blog._id
router.get('/:id',getFullBlog)

module.exports = router;