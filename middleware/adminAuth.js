const validateAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    return res.status(403).json({
      msg: "The user is not an admin",
    });
  }
};

module.exports = validateAdmin;
