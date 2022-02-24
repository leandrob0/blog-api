const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.register = [
  // Validate and sanitize data.
  body("username").trim().isLength({ min: 1 }).escape(),
  body("password").trim().isLength({ min: 8 }).escape(),

  async (req, res, next) => {
    // Gets the hashed password and searchs if the inserted username exists already
    const pw = await bcrypt.hash(req.body.password, 10);
    const foundUname = await User.findOne({ username: req.body.username });

    const errors = validationResult(req);

    if (!errors.isEmpty() || foundUname) {
      res.status(400).json({
        errors: errors.array(),
        msg: foundUname
          ? "The username already exists"
          : "The username or password are invalid.",
      });
    } else {
      const user = new User({
        username: req.body.username,
        password: pw,
        admin: false,
      });

      user.save((err) => {
        if (err) return next(err);
        res.status(201).end();
      });
    }
  },
];

exports.login = async function (req, res, next) {
  try {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        const error = new Error("User does not exist");
        return res.status(403).json({
          error,
          info,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) return next(err);
        // create token
        const token = jwt.sign({ user }, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });

        return res
          .status(200)
          .json({ username: user.username, admin: user.admin, token });
      });
    })(req, res, next);
  } catch (err) {
    res.status(403).json({
      err,
    });
  }
};

exports.get_users = (req, res, next) => {
  User.find({}).exec((err, users) => {
    if (err) return next(err);
    res.status(200).json(users);
  });
};
