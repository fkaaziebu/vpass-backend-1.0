const express = require("express");
const authRoutes = require("./src/routes/auth");

const app = express();

app.use(express.json());

app.use(authRoutes);

// console.log("env: " + process.env.NODE_ENV);

module.exports = app;
