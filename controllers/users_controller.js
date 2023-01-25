const User = require('../models/user');

module.exports.profile = function (req,res){  
    return res.render('user_profile',{
        title:"Codeial | sign Up",
    })
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
    //find user

    return res.redirect('/users/profile');

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
    req.logout(function(err){
        if(err)return err;
        return res.redirect("/");
    });
}