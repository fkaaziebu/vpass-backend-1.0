const express = require("express");
const register = require("../controllers/auth");

const router = express.Router();

router.post("/api/1.0/users", register);

module.exports = router;
