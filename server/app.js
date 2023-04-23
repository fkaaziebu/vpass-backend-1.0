const express = require("express");
const authRoutes = require("./src/routes/auth");
const ErrorHandler = require("./src/error/ErrorHandler");

const app = express();

app.use(express.json());

app.use(authRoutes);

app.use(ErrorHandler);

module.exports = app;
