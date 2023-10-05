const express = require("express");
const router = express.Router();
const User = require("../models/User.models");  // import models
const {handleLogIn, handleSignIn} = require("../controllers/user.controllers") // import controller

// Xử lý yêu cầu get cho trang login
router.get("/", (req, res) => {
  const {email, password} = req.body
  res.render("login", {errorMessages: [],email: '', password: ''});
});
// Xử lý yêu cầu get cho trang chủ
router.get("/index", (req, res) => {
  res.render("index");
});
// Xử lý yêu cầu get cho trang đăng ký
router.get("/register", (req, res) => {
  const {username, email, password} = req.body
  res.render("register", {errorMessages: [], email: '', password: '', username: ''});
});

// Xử lý yêu cầu POST cho trang login
router.post("/login", handleLogIn);


// Xử lý yêu cầu POST cho trang đăng ký
router.post("/register",handleSignIn);

module.exports = router;
