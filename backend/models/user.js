const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
        required: true,
        default: ''
    },
    pushToken: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: ''
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
