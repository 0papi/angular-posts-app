const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const { password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ err: "User already exists" });
  }

  const user = await User.create({ email, password: hashedPassword });

  await user.save();

  res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(400).json({ err: "User does not exist" });
    return;
  }

  const isPwdMatch = await bcrypt.compare(password, userExists.password);

  if (!isPwdMatch) {
    res.status(400).json({ err: "Passwords do not match" });
    return;
  }

  const token = jwt.sign(
    { email: userExists.email, userId: userExists._id },
    "akskfsdkkasksdkaklasfas",
    {
      expiresIn: "1hr",
    }
  );

  res.status(200).json({ token });
});

module.exports = router;
