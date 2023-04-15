const express = require("express");
const register = require("../controllers/auth");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/api/1.0/users",
  check("username").notEmpty().withMessage("Username cannot be null"),
  check("email").notEmpty().withMessage("Email cannot be null"),
  register
);

module.exports = router;
