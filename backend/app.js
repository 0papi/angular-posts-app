const express = require("express");

const app = express();

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

app.use("/api/posts", (req, res) => {
  const posts = [
    {
      id: "1jask038akd",
      title: "First dummy",
      content: "This is the first one",
    },
    {
      id: "4903w2jlkadas",
      title: "Second dummy",
      content: "This is the second one",
    },
    {
      id: "9403jlkadsfas",
      title: "Third dummy",
      content: "This is the third one",
    },
  ];
  res.status(200).json({ message: "Posts fetched successfully", posts });
});

module.exports = app;
