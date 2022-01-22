import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {} from "dotenv/config";

import ThunderUser from "../models/userSchema.js";

const router = express.Router();

export const signup = async (req, res) => {
  const { fullname, email, mobile, password } = req.body;
  const candidate = await ThunderUser.findOne({ email });
  if (candidate) {
    return res.status(400).json({
      error: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  var reactuser = new ThunderUser({
    fullname: fullname,
    email: email,
    mobile: mobile,
    password: hashedPassword,
  });
  try {
    await reactuser.save();
    const token = jwt.sign(
      {
        fullname: reactuser.fullname,
        email: reactuser.email,
        userId: reactuser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ reactuser, token });
  } catch (err) {
    res.sendStatus(500);
  }
};

export const login = async (req, res) => {
  const user = await ThunderUser.findOne({
    email: req.body.email,
  });
  if (user) {
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ user, token });
    } else {
      res.status(401).send("Password invalid");
    }
  } else {
    res.status(404).send("Email id not found");
  }
};
