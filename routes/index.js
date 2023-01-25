const express = require('express');
const  homeContoller = require('../controllers/home_controller');
const router = express.Router();

router.get('/',homeContoller.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));

module.exports = router;