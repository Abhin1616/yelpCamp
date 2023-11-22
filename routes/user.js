const express = require("express");
const router = express.Router();
const user = require("../contollers/user")
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const { storeReturnTo } = require("../utils/middleware")

router.route("/register")
    .get(user.registerShowPage)
    .post(wrapAsync(user.registerUser))
router.route("/login")
    .get(user.loginShowPage)
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), user.loginUser)

router.get('/logout', user.logoutUser);

module.exports = router;