const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// google login
passport.use(new googleStrategy({
    clientID: "328835469358-fkm4df5a2svd7locsoj1u907q7e538km.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ email: profile.emails[0].value }, function (err, user) {
        if(err){
            console.log("error in google strategy");
            return;
        }
        console.log(profile);
        if(user){
            return done(null, user);
        }else{
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
               password: crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log("error in google strategy creating user");
                    return;
                }
                return done(null, user);
            })
        }
    });
  }
));

module.exports = passport;