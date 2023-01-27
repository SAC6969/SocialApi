const express = require('express');
const passport = require('passport');
const postController = require('../controllers/posts_controller');
const router = express.Router();

router.post('/create', passport.checkAuthentication ,postController.create);
router.get('/destroy/:id', passport.checkAuthentication ,postController.destroy);

module.exports = router;