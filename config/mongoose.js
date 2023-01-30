const mongoose = require('mongoose');
const env = require('./enveronment');
mongoose.connect(`mongodb://127.0.0.1/${env.db}`);

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to MongoDb'));

db.once('open',function(){
    console.log('Connected to Database :: mongoDB');
})

module.exports = db;