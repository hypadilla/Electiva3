const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    message: { type: String, required: true, maxlength: 280 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
    lastModifiedBy: { type: String, default: 'system' }
});

const TweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = { TweetModel };
