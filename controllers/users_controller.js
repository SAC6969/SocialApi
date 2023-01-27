const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = function (req,res){  
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title: 'User Profile',
            profile_user:user
        })
    })
}

module.exports.update = async function (req,res){  
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('Error ',err);
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }

}

module.exports.signUp = function(req,res){  
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title:"Codeial | sign Up"
    })
}

module.exports.signIn = function(req,res){  
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title:"Codeial | sign In"
    })
}

module.exports.createUser = function(req,res){
    if(req.body.password != req.body.confirm_password){
        res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log("error in finding user");
            return;
        }

        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log("error in creating user");
                    return;
                }
                res.redirect('/users/sign-in');
            })
        }else{
            res.redirect('back');
        }
    })
}

module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');

    return res.redirect('/');

    // User.findOne({email: req.body.email},function(err,user){
    //     if(err){
    //         console.log("error in finding user in signing in");
    //         return;
    //     }

    //     // handle user found
    //     // handle password dont match
    //     if(user){
    //         //handle create session 
    //         if(user.password != req.body.password){
    //             return res.redirect('back');
    //         }
    //         res.cookie('user_id',user.id);
    //         return res.redirect('/users/profile');

    //     }else{
    //         //handle user not found
    //         return res.redirect('back');
    //     }

    // });
}

module.exports.destroySession = function(req,res){
    //find user
    req.flash('success','Logged out Successfully');
    req.logout(function(err){
        if(err)return err;
        return res.redirect("/");
    });
}