const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, maxlength: 100 },
    password: { type: String, minlength: 1 },
    admin: { type: Boolean, default: false},
  }
);

module.exports = new mongoose.Model("User", UserSchema);