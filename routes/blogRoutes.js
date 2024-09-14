const express = require("express");
const {createNewBlog,postNewBlog} = require("../controllers/blogController");

const router = express.Router();

router.get('/add-new',createNewBlog);;
router.post('/add-new',postNewBlog)

module.exports = router;