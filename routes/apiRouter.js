const router = require("express").Router();
const passport = require("passport");

const authController = require("../controllers/authController");

// POST log in a new user
router.post("/login", authController.login);

// GET protected route
router.get("/protected", passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.send("Logged in succesfully");
})

// POST register a new user.
router.post("/register", authController.register);

// GET all users to test API.
router.get("/users", authController.get_users);

module.exports = router;