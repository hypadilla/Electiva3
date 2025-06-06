const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: { createdAt: 'createdDate', updatedAt: 'lastModifiedDate' }
});

const FollowModel = mongoose.model('Follow', followSchema);

module.exports = { FollowModel };
