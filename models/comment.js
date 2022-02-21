const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    text: { type: String, maxlength: 200, minlength: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
