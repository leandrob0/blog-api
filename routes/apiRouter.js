const router = require("express").Router();
const passport = require("passport");

const validateAdmin = require("../middleware/adminAuth");

const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

/*

    USERS ROUTES.

*/

// POST register a new user.
router.post("/register", authController.register);

// POST log in a new user
router.post("/login", authController.login);

// POST log in an admin to the CMS. (only admins can log in)
router.post("/login/cms", authController.login_admin);

// GET all users to test API.
router.get("/users", authController.get_users);

/*

    POSTS ROUTES.

*/

// GET returns all the posts created (for the cms).
router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  validateAdmin,
  postController.get_all_posts
);

// POST creates a new post.
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  validateAdmin,
  postController.create_post
);

// GET returns X next posts created and published sorted by last updated or created.
router.get("/posts/sorted", postController.get_all_posts_published_sorted);

// GET details from a post.
router.get("/posts/:id", postController.get_post);

// GET returns X the posts created and published sorted by last updated or created.
router.get("/posts/:limit/sorted", postController.get_limit_posts_published_sorted);

// PUT updates a post.
router.put(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  validateAdmin,
  postController.update_post
);

// DELETE deletes a post.
router.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  validateAdmin,
  postController.delete_post
);

// PUT publishes a post.
router.put(
  "/posts/:id/publish",
  passport.authenticate("jwt", { session: false }),
  validateAdmin,
  postController.published_status_post
);

/*

    COMMENTS ROUTES.

*/

// POST creates a new comment.
router.post(
  "/posts/:id/comment",
  passport.authenticate("jwt", { session: false }),
  commentController.create_comment
);

// DELETE deletes a comment.
router.delete(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  validateAdmin,
  commentController.delete_comment
);

module.exports = router;
