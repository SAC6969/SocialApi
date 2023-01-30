const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const commnetsEmailWorker = require('../workers/comment_email_workers');
const queue = require('../config/kue');

module.exports.create = async function(req,res){
    //populate user of each 
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            
            post.comments.push(comment);
            post.save();
            
            let popComment = await Comment.findById(comment._id).populate('user','name email').exec();
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: popComment
                    },
                    message: "Comment is created"
                });
            }
            // queueMicrotask.create('emails',popComment).save(function(err){
            //     if(err){
            //         console.log("error in creating a queue");
            //     }
            //     console.log(job.id);
            // });

            commentsMailer.newComment(popComment);


            req.flash('success','Comment is created');
            return res.redirect('/');
        }
    }catch(err){
        console.log(err,"Errrrrrrrrr")
        req.flash('error',err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
            await Like.deleteMany({likeable: comment._id,onModel:'Comment'});

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment is deleted"
                });
            }

            req.flash('success','Comment deleted');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}