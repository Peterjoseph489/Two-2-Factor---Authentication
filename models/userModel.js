const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    referralcode: {
        type: String,
        required: [true, "Referral Code is required"],
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isLoggedin: {
        type: Boolean,
        default: false
    },
    twofa: {
        enabled: {
            type: Boolean,
            default: false
        },
        secret: {
            type: String,
            default: ""
        }
    }
});


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;