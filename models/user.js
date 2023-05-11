const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Cannot be blank'],
        unique: true
    },
    fair_tier: {
        type: Number,
        default: 1,
        min: 1,
        max: 6,
        required: true
    },
    phone_num: {
        type: String,
        required: [true, 'Cannot be blank'],
        unique: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
UserSchema.plugin(passportLocalMongoose);

const User =mongoose.model('User', UserSchema);
module.exports = User;