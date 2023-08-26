const express = require("express");
const router = express.Router();
const UserService = require("../user/UserService");
const AuthenticationException = require("./AuthenticationException");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const TokenService = require("./TokenService");
const ForbiddenException = require("../error/ForbiddenException");

router.post(
  "/api/1.0/auth",
  check("email").isEmail(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AuthenticationException());
    }
    const { email, password } = req.body;
    const user = await UserService.findByEmail(email);
    if (!user) {
      return next(new AuthenticationException());
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new AuthenticationException());
    }

    const token = await TokenService.createToken(user);

    // res.setHeader("Set-Cookie", "loggedIn=true");
    req.session.user_id = user.id;
    req.session.username = user.username;
    req.session.token = token;
    req.session.save();

    res.send({
      id: req.session.user_id,
      username: req.session.username,
      token: req.session.token,
    });
  }
);

router.get("/api/1.0/auth", (req, res) => {
  if (req.session.user_id) {
    res.send({
      id: req.session.user_id,
      username: req.session.username,
      token: req.session.token,
    });
  } else {
    res.send({});
  }
});

router.post("/api/1.0/logout", (req, res, next) => {
  try {
    req.session.destroy();
    res.send({});
  } catch (err) {
    return next(new ForbiddenException());
  }
});

module.exports = router;
