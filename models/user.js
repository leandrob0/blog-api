const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, maxlength: 100, required: true },
  password: { type: String, minlength: 8, required: true },
  admin: { type: Boolean, default: false, required: true },
});

module.exports = mongoose.model("User", UserSchema);
