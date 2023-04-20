const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotEnv = require("dotenv").config();

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

const app = express();

// connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to database"))
  .catch(() => console.log("connection failed"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);

module.exports = app;
