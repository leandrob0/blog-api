const passport = require("passport");

const authorized = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, token) => {
    if (error) {
      return res.status(403).json({ message: "Token expired" });
    }
    if (!token) {
      return res.status(400).json({ message: "Token invalid or missing" });
    }
    next();
  })(req, res, next);
};

module.exports = authorized;
