const router = require("express").Router();
const passport = require("passport");

const validateAdmin = require("../middleware/adminAuth");

const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

//test route
router.get("/protected", passport.authenticate('jwt', {session: false}) ,(req, res, next) => {
    res.send(req.user);
})

/*

    USERS ROUTES.

*/

// POST register a new user.
router.post("/register", authController.register);

// POST log in a new user
router.post("/login", authController.login);

/*

    POSTS ROUTES.

*/

// GET returns all the posts created.
router.get("/posts", postController.get_all_posts);

// POST creates a new post.
router.post("/posts", passport.authenticate('jwt', {session: false}) , validateAdmin , postController.create_post);

// GET details from a post.
router.get("/post/:id", postController.get_post);

// PUT updates a post.
router.put("/post/:id", passport.authenticate('jwt', {session: false}) , validateAdmin , postController.update_post);

// DELETE deletes a post.
router.delete("/post/:id", passport.authenticate('jwt', {session: false}) , validateAdmin , postController.delete_post);

// PUT updates a post.
router.put("/post/:id/publish", passport.authenticate('jwt', {session: false}) , validateAdmin , postController.published_status_post);


/*

    COMMENTS ROUTES.

*/

// GET all users to test API.
router.get("/users", authController.get_users);

module.exports = router;