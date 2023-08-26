const express = require("express");
const AuthenticationRouter = require("./auth/AuthenticationRouter");
const UserRouter = require("./user/UserRouter");
const tokenAuthentication = require("./middleware/tokenAuthentication");
const ErrorHandler = require("./error/ErrorHandler");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/database");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["https://vpass-frontend.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  session({
    key: "userInfo",
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

app.use(tokenAuthentication);

app.use(UserRouter);

app.use(AuthenticationRouter);

app.use(ErrorHandler);

module.exports = app;
