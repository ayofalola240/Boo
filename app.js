"use strict";

const express = require("express");
const dotenv = require("dotenv");
const ErrorHandler = require("./routes/error-handler");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

dotenv.config({ path: ".env" });
// set the view engine to ejs
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js", "./schema/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use("/profile", require("./routes/profile")());
app.use("/comment", require("./routes/comment")());

app.all("*", (req, res, next) => {
  next(`Can't find ${req.originalUrl} on this server`);
});

app.use(ErrorHandler);

module.exports = app;
