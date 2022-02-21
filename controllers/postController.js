const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.get_all_posts = (req, res, next) => {
  Post.find({}).exec((err, posts) => {
    if (err) return next(err);
    res.status(200).json({
      posts,
    });
  });
};

exports.create_post = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("text").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      author: req.user._id,
      title: req.body.title,
      text: req.body.text,
      published: false,
      comments: [],
    });

    if (!errors.isEmpty()) {
      res.send(400).json({
        errors: errors.array(),
        post: post,
        msg: "Invalid title or text",
      });
    } else {
      post.save((err) => {
        if (err) return next(err);
        res.status(201).json(post);
      });
    }
  },
];

exports.get_post = (req, res, next) => {
  Post.findById(req.params.id)
    .populate("author", "username")
    .exec((err, post) => {
      if (err) return next(err);
      if (!post) {
        res.status(400).json({
          msg: "The post was not found.",
        });
      }
      res.status(200).json({
        post,
      });
    });
};

exports.update_post = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("text").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        res.status(400).json({
          msg: "The post was not found.",
        });
      }

      const updatedPost = new Post({
        _id: post._id,
        author: req.user._id,
        title: req.body.title,
        text: req.body.text,
        published: post.published,
        comments: post.comments,
      });

      if (!errors.isEmpty()) {
        res.send(400).json({
          errors: errors.array(),
          post: updatedPost,
          msg: "Invalid title or text",
        });
      } else {
        const newPost = await Post.findByIdAndUpdate(
          req.params.id,
          updatedPost
        );
        res.status(201).json({
          post: newPost,
        });
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_post = (req, res, next) => {
  Post.findByIdAndRemove(req.params.id, function deletePost(err) {
    if (err) return next(err);

    Post.find({}).exec((err, posts) => {
      if (err) return next(err);
      res.status(200).json({
        posts,
      });
    });
  });
};

exports.published_status_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    const updatedPost = new Post({
      _id: post._id,
      author: post.author,
      title: post.title,
      text: post.text,
      published: !post.published,
      comments: post.comments,
    });

    const newPost = await Post.findByIdAndUpdate(req.params.id, updatedPost);
    res.status(201).json({
      post: newPost,
    });
  } catch (err) {
    return next(err);
  }
};
