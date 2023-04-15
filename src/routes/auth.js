const express = require("express");
const register = require("../controllers/auth");

const router = express.Router();

const validateUsername = (req, res, next) => {
  const user = req.body;
  if (user.username === null) {
    req.validationErrors = {
      username: "Username cannot be null",
    };
  }
  next();
};

const validateEmail = (req, res, next) => {
  const user = req.body;
  if (user.email === null) {
    req.validationErrors = {
      ...req.validationErrors,
      email: "Email cannot be null",
    };
  }
  next();
};

router.post("/api/1.0/users", validateUsername, validateEmail, register);

module.exports = router;
