const express = require("express");
const UserService = require("./UserService");
const { check, validationResult } = require("express-validator");
const ValidationException = require("../error/ValidationException");
const ForbiddenException = require("../error/ForbiddenException");
const en = require("../../locales/en/translation.json");

const router = express.Router();

router.post(
  "/api/1.0/users",
  check("username")
    .notEmpty()
    .withMessage(en.username_null)
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage(en.username_size),
  check("email")
    .notEmpty()
    .withMessage(en.email_null)
    .bail()
    .isEmail()
    .withMessage(en.email_invalid)
    .bail()
    .custom(async (email) => {
      const user = await UserService.findByEmail(email);
      if (user) {
        throw new Error(en.email_inuse);
      }
    }),
  check("password")
    .notEmpty()
    .withMessage(en.password_null)
    .bail()
    .isLength({ min: 6 })
    .withMessage(en.password_size)
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage(en.password_pattern),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }

    await UserService.save(req.body);
    return res.send({ message: "User created" });
  }
);

router.post(
  "/api/1.0/users/create-password/:id",
  check("description")
    .notEmpty()
    .withMessage(en.description_null)
    .bail()
    .isLength({ min: 3, max: 64 })
    .withMessage(en.description_size),
  check("password")
    .notEmpty()
    .withMessage(en.password_null)
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage(en.spassword_size),
  async (req, res, next) => {
    const authenticatedUser = req.authenticatedUser;

    // eslint-disable-next-line eqeqeq
    if (!authenticatedUser || authenticatedUser.id != req.params.id) {
      return next(new ForbiddenException(en.unauthorized_password_creation));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }

    await UserService.createPassword(req.params.id, req.body);

    res.send({ message: en.password_created });
  }
);

router.get("/api/1.0/passwords/:id", async (req, res, next) => {
  const authenticatedUser = req.authenticatedUser;

  // eslint-disable-next-line eqeqeq
  if (!authenticatedUser || authenticatedUser.id != req.params.id) {
    return next(new ForbiddenException(en.unauthorized_password_load));
  }

  const passwords = await UserService.passwords(req.params.id);
  res.send({ passwords });
});

router.get("/api/1.0/password/:id/:userId", async (req, res, next) => {
  const authenticatedUser = req.authenticatedUser;

  // eslint-disable-next-line eqeqeq
  if (!authenticatedUser || authenticatedUser.id != req.params.userId) {
    return next(new ForbiddenException(en.unauthorized_password_load));
  }

  const password = await UserService.password(req.params.id, req.params.userId);
  res.send({ password });
});

module.exports = router;
