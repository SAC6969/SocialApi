const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');


module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        })

        let popPost = await Post.findById(post._id).populate("user","-password");
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post : popPost
                },
                message: 'post is created'
            });
        }

        req.flash('success','Post is created');
        return res.redirect('back');
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        //.id means convertng the object id into string

        if(post.user == req.user.id){
            await Like.deleteMany({likeable: post, onModel:'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            post.remove();
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'Post deleted'
                })
            }

            req.flash('success','Post is deleted');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}