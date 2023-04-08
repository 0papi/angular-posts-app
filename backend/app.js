const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotEnv = require("dotenv").config();

const PostSchema = require("./models/post");

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
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new PostSchema({
    title: req.body.title,
    content: req.body.content,
  });

  post.save();

  res
    .status(201)
    .json({ message: "Post added successfully", postId: post._id });
});

app.get("/api/posts", async (req, res) => {
  const posts = await PostSchema.find();
  res.status(200).json({ message: "Posts fetched successfully", posts });
});

app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;

  const deletedPost = await PostSchema.findOneAndDelete({ _id: id });

  res
    .status(200)
    .json({ message: "Post deleted successfully", post: deletedPost });
});

module.exports = app;
