const express = require("express");
const AuthenticationRouter = require("./auth/AuthenticationRouter");
const UserRouter = require("./user/UserRouter");
const tokenAuthentication = require("./middleware/tokenAuthentication");
const ErrorHandler = require("./error/ErrorHandler");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

app.use(tokenAuthentication);

app.use(UserRouter);

app.use(AuthenticationRouter);

app.use(ErrorHandler);

module.exports = app;
