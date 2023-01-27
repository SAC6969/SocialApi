const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose.js');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const multer  = require('multer')

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(expressLayouts);

// extract style and script
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// set up view engine
app.set('view engine','ejs');
app.set('views','./views');

// mongo store use to save session cookie in th db
app.use(session({
    name: 'Codeial',
    secret: 'blahsomething',
    saveUninitialized: false, 
    resave: false,
    cookie: {
        maxAge: (1000* 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl : 'mongodb://127.0.0.1/codial',
            autoRemove : 'disable'
        },
        function(err){
            console.log(err || 'connect-mongodb setup');
        }
    )
}))


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticateUser);

app.use(flash());
app.use(customMware.setFlash);

// use router 
app.use('/',require('./routes'));

app.listen(PORT,function(err){
    if(err){
        console.log('error while listing port',err);
    }
    console.log('Server running on port ',PORT );
})