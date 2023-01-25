const Post = require('../models/post');

module.exports.home = function(req,res){
    //populate user of each 
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path: 'user'
        }
    })
    .exec(function(err,posts){
        if(err){
            console.log(err);
            return;
        }
        return res.render('home',{
            title: 'Home',
            posts:posts
        })
    })
}

