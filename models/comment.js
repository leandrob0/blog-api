const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    author: { type: String, maxlength: 30, minlength: 2 },
    text: { type: String, maxlength: 200, minlength: 1 },
  },
  { timestamps: true }
);

module.exports = new mongoose.Model("Comment", CommentSchema);
