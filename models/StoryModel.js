const mongoose = require('mongoose');
const User = require('./userSchema')
const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: User
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    comment : {
        type: String
    }

})

module.exports = mongoose.model('Story', storySchema);