const express = require("express");
const authRoutes = require("./routes/auth");

const app = express();

app.use(authRoutes);

module.exports = app;