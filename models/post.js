const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, minlength: 1 , maxlength: 100 },
    text: { type: String, minlength: 1 },
    published: { type: Boolean, default: false },
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
