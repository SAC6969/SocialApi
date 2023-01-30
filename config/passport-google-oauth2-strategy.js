const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./enveronment');

// google login
passport.use(new googleStrategy({
    clientID: env.google_client_ID,
    clientSecret: env.google_client_clientSecret,
    callbackURL: env.google_callbackURL
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