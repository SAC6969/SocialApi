const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    // this defines the object id of the liked object
    onModel: {
        type: String,
        require: true,
        enum: ['Post','Comment']
    }
},{
    timestamps: true
})

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
