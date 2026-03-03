// user profile database schema
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username:    { type: String, required: true },
    // profilePic:      { type: String },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        color: {
            type: String,
            enum: ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'teal'],
            default: 'blue'
        },
    }
});

module.exports = mongoose.model('Profile', profileSchema);