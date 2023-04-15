const express = require("express");
const authRoutes = require("./src/routes/auth");

const app = express();

app.use(express.json());

app.use(authRoutes);

module.exports = app;
