const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.create_comment = [
  body("text").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    // Gets the post of the comment.
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({
        msg: "The post was deleted.",
      });
    }

    // Creates the comment with the post _id and the author _id.
    const comment = new Comment({
      post: post._id,
      author: req.user._id,
      text: req.body.text,
    });

    if (!errors.isEmpty()) {
      res.status(400).json({
        comment,
      });
    } else {
      comment.save(async (err) => {
        if (err) return next(err);

        // After saving the comment returns every comment.
        const comments = await Comment.find({}).populate("author", "username");
        res.status(200).json({
          comments,
        });
      });
    }
  },
];

exports.delete_comment = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.id, function deletedComment(err) {
    if (err) return next(err);

    Comment.find({}).exec((err, comments) => {
      if (err) return next(err);
      res.status(200).json({
        comments,
      });
    });
  });
};
