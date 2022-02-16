import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { } from "dotenv/config";
import ThunderUser from "../models/userSchema.js";
import { sendEmail } from "../services/MailService.js";
import Verification from "../models/Verification.js";
import mongoose from "mongoose";
const router = express.Router();

export const signup = async (req, res) => {
  const { fullname, email, mobile, password, pin } = req.body;
  const candidate = await ThunderUser.findOne({ mobile });
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
    pin: pin,
  });
  try {
    await reactuser.save();
    res.status(201).json({ reactuser });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  const user = await ThunderUser.findOne({
    email: req.body.email,
  });
  // console.log(user)
  if (user) {
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          email: user.email,
          mobile: user.mobile,
          id: user._id,
          pin: user.pin,
          name: user.fullname,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({ user, token });
    } else {
      res.status(401).send({ error: "Password invalid" });
    }
  } else {
    res.status(404).send({ error: "Email id not found" });
  }
};

export const getUser = async (req, res) => {
  const user = await ThunderUser.find({});
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.status(200).json(user);
};

export const forgotPassword = async (req, res) => {
  const user = await ThunderUser.findOne({
    email: req.body.email,
  });
  // console.log(user);
  if (user) {
    if (user.mobile === req.body.mobile) {
      const OTP = Math.floor(1000 + Math.random() * 9000);
      // console.log(OTP);
      sendEmail({
        subject: "OTP Verification for ThunderPe",
        text: `Hi there, your OTP for verification is ${OTP}`,
        to: user.email,
        from: process.env.GOOGLE_EMAIL,
      });

      const veri = await Verification.create({ otp: OTP });
      res.status(200).json({ user, id: veri._doc._id });
    } else {
      console.log("Mobile number not found");
      res.status(401).json("Invalid Mobile Number");
    }
  } else {
    console.log("Email id not found");
    res.status(404).json("Email id not found");
  }
  console.log("done");
};

export const getVerification = async (req, res) => {
  const user = await Verification.find({});
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.status(200).json(user);
};

export const verifyOTP = async (req, res) => {
  try {
    const { id, otp } = req.body;
    let _id = mongoose.Types.ObjectId(id)
    console.log(typeof (_id))
    const veri = await Verification.findOne({ _id });
    console.log(veri);
    if (!veri) {
      return res.status(404).send({ error: "Invalid Verification ID" });
    }
    if (veri.otp !== otp) {
      return res.status(404).send({ error: "Incorrect OTP" });
    }
    await Verification.deleteOne({ _id: id });
    return res.status(200).send({ isValid: true });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await ThunderUser.findOne({
      email: req.body.email,

    });
    if (user) {
      const password = req.body.password
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword
      await user.save()
      res.status(200).send({ user })
    }
    else {
      res.status(404).send({ error: 'No user found' })
    }
  }
  catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
}
export const updateUser = async (req, res) => {
  try {
    const user = await ThunderUser.findOne({
      email: req.body.email,
    });
    if (user) {
      const fullname = req.body.fullname
      const pin = req.body.pin
      user.fullname = fullname
      user.pin = pin
      await user.save()
      const token = jwt.sign(
        {
          email: user.email,
          mobile: user.mobile,
          id: user._id,
          pin: pin,
          name: fullname,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({ user, token });
    }
  }
  catch (e) {
    logger.error(e)
    res.status(500).send({ error })
  }
}