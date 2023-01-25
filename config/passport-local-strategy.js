const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email,password,done){
        //find a user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                console.log("Error in finding user -> passport");
                return done(err);
            }
            if(!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null,false);
            }

            return done(null,user);
        });
    }   
));

// serializing the user to decide which key is to be kept in cookie
passport.serializeUser(function(user,done){
    done(null,user.id);  //encrypt the id of user
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("Error in finding user -> passport");
            return done(err);
        }

        return done(null,user);
    });
});

// check if the user authentication
passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticateUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user is current signed in user 
        // res.locals.user ?????
        res.locals.user = req.user;
    }
    next();
}



module.exports = passport;