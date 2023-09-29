const User = require("../models/userModel");
const { genToken, decodeToken } = require("../utilities/jwt");
const qrcode = require("qrcode");
const { authenticator } = require("otplib");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { otpAuth } = require("../utilities/authenticator");



const newuser = async (req, res) => {
  try {
    console.log('Obi')
    const { username, email, password } = req.body;
    const isEmail = await User.findOne({ email });
    if (isEmail) {
      res.status(409).json({
        message: "email already registerd",
      });
    } else {
      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(password, salt);
      const referralcode = uniqid.time();
      const user = await User.create({
        username,
        email: email.toLowerCase(),
        referralcode,
        password: hash,
      });
      res.status(201).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //console.log(user);
    let checkPassword = false;
    if (user) {
      req.user = user;
      checkPassword = bcryptjs.compareSync(password, user.password);
      if (!checkPassword) {
        res.status(400).json({
          message: "invalid password",
        });
      }
      else {
        if (user.twofa.enabled) {
          const verified = await otpAuth(req);
          if (verified) {
            user.isloggedin = true;
            const token = await genToken(user._id, "1d");
            await user.save();
            const userRes = await User.findById(user._id);
            const { username, email, twofa, referralcode } = userRes;
            res.status(200).json({
              user: {
                token,
                username,
                email,
                twofa,
                referralcode,
              },
            });
          } else {
            res.status(503).json({
              message:
                "Invalid OTP, two factor authentication for this user is required",
            });
          }
        } else {
          user.isLoggedin = true;
          const token = await genToken(user._id, "1d");
          await user.save();
          const userRes = await User.findById(user._id);
          const { username, email, twofa, referralcode } = userRes;
          res.status(200).json({
            user: {
              token,
              username,
              email,
              twofa,
              referralcode,
            },
          });
        }
      }
    } else {
      res
        .status(400)
        .json({ message: "invalid email, please enter a registered email." });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




const qrimage = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(user.email, "wallet-auth", secret);
    // console.log(uri);
    // console.log(secret);
    const image = await qrcode.toDataURL(uri);
    user.twofa.secret = secret;
    console.log(secret)
    await user.save();
    res.status(200).json({
      success: true,
      image,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const enableTwoFactorAuth = async (req, res) => {
  try {
    const { _id } = req.user;
    const { code } = req.body;
    const user = await User.findById(_id);
    // console.log(user)
    const verified = await otpAuth(req);
    console.log(verified)
    if (verified) {
      user.twofa.enabled = true;
      await user.save();
      res.status(200).json({
        message: "success",
      });
    } else {
      res.status(401).json({
        message: "invalid code, try again",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { newuser, signin, enableTwoFactorAuth, qrimage };
