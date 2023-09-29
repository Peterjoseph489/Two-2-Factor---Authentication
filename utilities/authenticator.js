const User = require('../models/userModel');
const { authenticator } = require('otplib');

const otpAuth = async (req, res) => {
    const { _id } = req.user;
    const { code } = req.body;
    const user = await User.findById(_id);
    console.log(user)
    const verified = authenticator.check(code, user.twofa.secret);
    if (!verified) {
        return false
    } else {
        return true
    }
};

module.exports = { otpAuth };