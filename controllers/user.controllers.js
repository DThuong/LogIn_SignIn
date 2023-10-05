const User = require("../models/User.models"); // import models user
const bcrypt = require("bcrypt"); // hash password
const validator = require("email-validator");

// Hàm xử lý phương thức post của login
const handleLogIn = async (req, res) => {
  const { password, email } = req.body;
  const errorMessages = [];
  let hasError = false;

  // Kiểm tra email
  if (!email) {
    errorMessages.push("Vui lòng nhập email!");
    hasError = true;
  } else if (!validator.validate(email)) {
    errorMessages.push("Email không hợp lệ!");
    hasError = true;
  }

  // Kiểm tra password
  else if (!password) {
    errorMessages.push("Vui lòng nhập password!");
    hasError = true;
  } else if (password.length < 6) {
    errorMessages.push("Mật khẩu phải chứa ít nhất 6 kí tự!");
    hasError = true;
  }

  if (errorMessages.length === 0) {
    const FindUser = await User.findOne({ email });
    if (FindUser) {
      const isMatch = await bcrypt.compare(password, FindUser.password);
      if (isMatch) {
        // Lưu thông tin email vào cookie
        res.cookie("email", FindUser.email);
        res.render("index");
        return;
      } else {
        errorMessages.push("Sai mật khẩu!");
        hasError = true;
      }
    } else {
      errorMessages.push("Email không tồn tại!");
      hasError = true;
    }
  }
  if(hasError) {
    // Truyền tất cả thông báo lỗi vào template
    res.render("login", { errorMessages, email, password });
  }
};

// hàm xử lý phương thức post của register
const handleSignIn = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let errorMessages = [];
    // kiểm tra username
    if (!username) {
      errorMessages.push("Vui lòng nhập username");
    } else if (username.length < 3) {
      errorMessages.push("Username phải chứa ít nhất 3 kí tự!");
    }
    // Kiểm tra email
    else if (!email) {
      errorMessages.push("Vui lòng nhập email!");
    } else if (!validator.validate(email)) {
      errorMessages.push("Email không hợp lệ!");
    }
    // Kiểm tra password
    else if (!password) {
      errorMessages.push("Vui lòng nhập password!");
    } else if (password.length < 6) {
      errorMessages.push("Mật khẩu phải chứa ít nhất 6 kí tự!");
    }

    if (errorMessages.length === 0) {
      // hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // tạo thông tin trong cơ sở dữ liệu
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      // lưu thông tin email vào cookie
      res.cookie("email", newUser.email);
      res.redirect("/"); // chuyển hướng người dùng tới trang đăng nhập
    }
    res.render("register", { errorMessages, email, username, password });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleLogIn,
  handleSignIn,
};
