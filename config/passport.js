const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }).exec((err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: "Incorrect username" });
  
        // Compares the password passed in the login form, with the hashed and salted one in the db.
        bcrypt.compare(password, user.password, (err, res) => {
          // Error on the operation.
          if (err) return done(err);
          // The passwords don't match
          if (!res) return done(null, false, { message: "Incorrect password" });
          // The passwords match, everything ok.
          return done(null, user);
        });
      });
    })
  );

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    function (jwtPayload, cb) {
      //find the user in db.
      return User.findById(jwtPayload.user._id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

module.exports = passport;
