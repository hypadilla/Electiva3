const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: String, default: 'system' },
    lastModifiedDate: { type: Date, default: Date.now },
    lastModifiedBy: { type: String, default: 'system' },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {
    UserModel
};
