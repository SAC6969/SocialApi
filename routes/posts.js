const express = require('express');
const postController = require('../controllers/posts_controller');
const router = express.Router();

router.get('/post',postController.posts);

module.exports = router;