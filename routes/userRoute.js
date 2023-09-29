const express = require("express");
const {
  newuser,
  signin,
  enableTwoFactorAuth,
  qrimage,
} = require("../controllers/userController");
const { userAuth } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/newuser", newuser);
router.post("/login", signin);
router.put("/qrimage", userAuth, qrimage);
router.put("/enable2fa", userAuth, enableTwoFactorAuth);

module.exports = router;