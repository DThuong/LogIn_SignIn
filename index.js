//import
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); // kết nối với cơ sở dữ liệu và thao tác với dữ liệu
const session = require("express-session"); // quản lý phiên người dùng như đăng nhập
const router = require("./routers")
const bodyParser = require("body-parser") // Cài body-parser xử lý phương thức gửi từ form
const cookie = require("cookie-parser") // cài cookie-parser lưu phiên người dùng

const app = express();
const PORT = process.env.PORT || 3000; // truy cập biến môi trường
const DB_URI = process.env.DB_URI; // truy cập biến môi trường lấy đường dẫn tới database

// Kết nối tới cơ sở dữ liệu mongodb
const checkDBConnection = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Đã kết nối tới cơ sở dữ liệu MongoDB!");
  } catch (error) {
    console.error(
      "Không thể kết nối tới cơ sở dữ liệu MongoDB:"
    );
  }
};
checkDBConnection();

// middlewares
app.use(bodyParser.urlencoded({ extended: true })); // bodyParser phân tách nội dung POST
app.use(cookie())
app.use(express.json()); // chuyển các định dạng dữ liệu được lấy về sang dạng json

app.use( // set up phiên người dùng
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

// app.use((req,res,next) => { // lưu session message vào biến message
//   res.locals.message = req.session.message;
//   delete req.session.message; // xóa thông báo message sau khi hiển thị
//   next();
// })

app.use(express.static("uploads")); // static file tới thư mục uploads để lưu ảnh trên server

// static file (set up sử dụng đường dẫn tới các thư mục public
const path = require("path"); 
const pathPublic = path.join(__dirname, "./public");
app.use(express.static(pathPublic));

// set template engine ejs
app.set('view engine', 'ejs');

// router prefix
app.use("", router)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
