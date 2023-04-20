const express = require("express");
const multer = require("multer");
const checkAuth = require("../middlewares/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const PostSchema = require("../models/post");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error(" Invalid mime type");

    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  fileName: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// handles creating new post
router.post(
  "/",
  checkAuth,
  multer(storage).single("image"),
  (req, res, next) => {
    const post = new PostSchema({
      title: req.body.title,
      content: req.body.content,
    });

    post.save();

    res
      .status(201)
      .json({ message: "Post added successfully", postId: post._id });
  }
);

router.patch("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;

  const updates = {
    title: req.body.title,
    content: req.body.content,
  };

  const updatedPost = await PostSchema.findOneAndUpdate({ _id: id }, updates, {
    new: true,
  });

  res.status(200).json({ message: "Post updated", post: updatedPost });
});

router.get("/", async (req, res) => {
  const posts = await PostSchema.find();
  res.status(200).json({ message: "Posts fetched successfully", posts });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await PostSchema.findById(id);

  if (post) {
    res.status(200).json({ post });
  } else {
    res.status(400).json({ error: "Post not found" });
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;

  const deletedPost = await PostSchema.findOneAndDelete({ _id: id });

  res
    .status(200)
    .json({ message: "Post deleted successfully", post: deletedPost });
});

module.exports = router;
