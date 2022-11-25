"use strict";

const express = require("express");
const dotenv = require("dotenv");
const ErrorHandler = require("./routes/error-handler");

const app = express();

dotenv.config({ path: ".env" });
// set the view engine to ejs
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));

// routes
app.use("/profile", require("./routes/profile")());
app.use("/comment", require("./routes/comment")());

app.all("*", (req, res, next) => {
  next(`Can't find ${req.originalUrl} on this server`);
});

app.use(ErrorHandler);

module.exports = app;
