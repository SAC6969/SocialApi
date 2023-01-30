const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friendship = require('../models/friendship');

module.exports.profile = function (req,res){  
    User.findById(req.params.id,function(err,user){
        if (err) { console.log("Error in finding the user"); return; }

        const exist = req.user.friendships.find((value)=>{
            if(user.friendships.includes(value)){
                return true;
            }
        })

        let friend = false;
        if(exist){
            friend = true;
        }

        return res.render('user_profile',{
            title: 'User Profile',
            profile_user:user,
            friend: friend,
            friendshipId: exist
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

module.exports.makeFriend = async function (req, res) {
    try {
        // make a friendship
        let friendship = await Friendship.create({
            from_user: req.user.id,
            to_user: req.query.toUser
        });

        // now a store this friendship in both the user
        let toUser = await User.findById(req.query.toUser);
        toUser.friendships.push(friendship);
        toUser.save();

        req.user.friendships.push(friendship);
        req.user.save();

        return res.status(200).json({
            message: "friendship done",
            data: {
                toUser: toUser._id,
                friend: true,
                friendshipId: friendship._id
            }
        });

    } catch (err) {
        console.log("Error in making friendship", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


module.exports.removeFriend = async function (req, res) {
    try {
       
        // remove this friendship from the both the use
        await User.findByIdAndUpdate(req.query.profileUser, {$pull: {friendships: req.query.friendshipId}});

        await User.findByIdAndUpdate(req.user.id, { $pull: { friendships: req.query.friendshipId } });

        await Friendship.findByIdAndRemove(req.query.friendshipId);

        return res.status(200).json({
            message: "friendship remove",
            data: {
                friend: false,
                toUser: req.query.profileUser
            }
        });

    } catch (err) {
        console.log("Error in removing friendship", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}