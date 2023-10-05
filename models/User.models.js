const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true
  },
  created: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
