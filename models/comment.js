const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, maxlength: 200, minlength: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
