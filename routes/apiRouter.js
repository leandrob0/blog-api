const router = require("express").Router();

const authController = require("../controllers/authController");

// POST register a new user.
router.post("/register", authController.register);

// GET all users to test API.
router.get("/users", authController.get_users);

module.exports = router;