const Post = require("../models/post");
const Comment = require("../models/comment");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.get_all_posts = (req, res, next) => {
  Post.find({})
    .populate("author", "username")
    .exec((err, posts) => {
      if (err) return next(err);
      res.status(200).json({
        posts,
      });
    });
};

exports.get_all_posts_published = (req, res, next) => {
  Post.find({ published: true })
    .populate("author", "username")
    .exec((err, posts) => {
      if (err) return next(err);
      res.status(200).json({
        posts,
      });
    });
};

exports.create_post = [
  // Validates and sinitizes the data.
  body("title").trim().isLength({ min: 1 }).escape(),
  body("text").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    // Checks if there are any errors in the validation.
    const errors = validationResult(req);

    const post = new Post({
      author: req.user._id,
      title: req.body.title,
      text: req.body.text,
      published: false,
    });

    if (!errors.isEmpty()) {
      res.send(400).json({
        errors: errors.array(),
        post: post,
        msg: "Invalid title or text",
      });
    } else {
      // If there are no errors, saves the post to the db.
      post.save((err) => {
        if (err) return next(err);
        res.status(201).json(post);
      });
    }
  },
];

exports.get_post = (req, res, next) => {
  // Executes both the db queries in parallel.
  async.parallel(
    {
      post: (cb) =>
        Post.findById(req.params.id).populate("author", "username").exec(cb),
      comments: (cb) =>
        Comment.find({ post: req.params.id })
          .populate("author", "username")
          .exec(cb),
    },
    // When the execution of the previous queries finishes, calls this callback.
    (err, results) => {
      if (err) return next(err);
      // If a post wasn't found, returns an 404.
      if (results.post == null) {
        res.status(404).end();
      }
      // else returns the post and its comments.
      res.status(200).json({
        post: results.post,
        comments: results.comments,
      });
    }
  );
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
  // Finds and removes the post.
  Post.findByIdAndRemove(req.params.id, function deletePost(err) {
    if (err) return next(err);
    // Deletes every comment linked to that post
    Comment.deleteMany({ post: req.params.id }, function deletedComments(err) {
      if (err) return next(err);
    });
    // Returns every post after deletion.
    Post.find({}).exec((err, posts) => {
      if (err) return next(err);
      res.status(200).json({
        posts,
      });
    });
  });
};

// Toggles the publish status.
exports.published_status_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    const updatedPost = new Post({
      _id: post._id,
      author: post.author,
      title: post.title,
      text: post.text,
      published: !post.published,
    });

    const newPost = await Post.findByIdAndUpdate(req.params.id, updatedPost);
    res.status(201).json({
      post: newPost,
    });
  } catch (err) {
    return next(err);
  }
};
