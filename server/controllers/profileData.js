import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {} from "dotenv/config";
import ThunderUser from "../models/userSchema.js";

const router = express.Router();

export const UserData = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }
  const user = await ThunderUser.findOne({
    mobile: req.userId.mobile,
  }).exec();
  try {
    const data = {
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
    };
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
