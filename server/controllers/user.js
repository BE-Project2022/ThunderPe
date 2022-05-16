import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { } from "dotenv/config";
import ThunderUser from "../models/userSchema.js";
import { sendEmail } from "../services/MailService.js";
import Verification from "../models/Verification.js";
import mongoose from "mongoose";
import { Buffer } from "buffer";
import Web3 from 'web3'
import { createRequire } from 'module'
import Axios from 'axios';
import { ethers } from 'ethers'
const require = createRequire(import.meta.url);
const file = require('../ABI.json')
var Tx = require('ethereumjs-tx').Transaction
const router = express.Router();

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/1d20c176d3dc453bab9f2571b173a8cd'))
const contract = new web3.eth.Contract(file.abi, process.env.CONTRACT_ADDRESS)
export const signup = async (req, res) => {

  const { fullname, email, mobile, password, pin, image } = req.body;
  const candidate = await ThunderUser.findOne({ mobile });
  if (candidate) {
    return res.status(400).json({
      error: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const acc = web3.eth.accounts.create()
  let network = 'rinkeby'
  let provider = ethers.getDefaultProvider(network)
  // console.log(provider)
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  // console.log(wallet)
  let amountInEther = '0.04'
  let tx = {
    to: acc.address,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther(amountInEther)
  }
  wallet.sendTransaction(tx)
    .then((txObj) => console.log('txHash', txObj.hash))
    .catch((err) => console.log(err))
  var reactuser = new ThunderUser({
    fullname: fullname,
    email: email,
    mobile: mobile,
    password: hashedPassword,
    pin: pin,
    image: image,
    key: acc.privateKey,
    address: acc.address
  });
  try {
    await reactuser.save();
    const user = await ThunderUser.findOne({
      email: email,
    });
    const token = jwt.sign(
      {
        email: email,
        mobile: mobile,
        id: user._id,
        pin: pin,
        name: fullname,
        image: image,
        key: acc.privateKey,
        address: acc.address
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user.token = token
    await user.save()
    res.status(201).json({ user });
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
          image: user.image,
          key: user.key,
          address: user.address
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      user.token = token
      await user.save()
      res.status(201).json({ user, token });
    } else {
      res.status(401).send({ error: "Password invalid" });
    }
  } else {
    res.status(404).send({ error: "Email id not found" });
  }
};

export const isLoggedIn = async (req, res) => {
  const user = await ThunderUser.findOne({
    email: req.body.email
  })
  if (user) {
    if (user.token) {
      return res.status(201).send({ result: true })
    }
    else {
      res.status(201).send({ result: false })
    }
  }
  else {
    res.status(404).send({ error: "Email id not found" });
  }
}

export const checkToken = async (req, res) => {
  try {
    console.log(req.body.email)
    const token = await ThunderUser.findOne({
      email: req.body.email
    })
    console.log(token.token === req.body.token)
    // console.log(req.body.token)
    if (token.token === req.body.token) {
      res.status(200).send({ result: true })
    }
    else {
      res.status(201).send({ result: false })
    }
  }
  catch (error) {
    res.status(501).send({ error })
  }
}


export const getUser = async (req, res) => {
  const user = await ThunderUser.find({});
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.status(200).json(user);
};

export const verifyEmail = async (req, res) => {
  try {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    sendEmail({
      subject: "OTP Verification for ThunderPe",
      text: `Hi there, your OTP for verification is ${OTP}`,
      to: req.body.email,
      from: process.env.GOOGLE_EMAIL,
    });
    const veri = await Verification.create({ otp: OTP });
    res.status(200).json({ id: veri._doc._id });
  }
  catch (error) {
    res.status(501).send({ error })
  }

}


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
    // console.log(typeof (_id))
    const veri = await Verification.findOne({ _id });
    // console.log(veri);
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
      const image = req.body.image
      console.log(image)
      user.fullname = fullname
      user.pin = pin
      user.image = image
      await user.save()
      const token = jwt.sign(
        {
          email: user.email,
          mobile: user.mobile,
          id: user._id,
          pin: pin,
          name: fullname,
          image: image,
          key: user.key,
          address: user.address
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      user.token = token
      await user.save()
      res.status(201).json({ user, token });
    }
  }
  catch (e) {
    logger.error(e)
    res.status(500).send({ error })
  }
}

export const transactionHistory = async (req, res) => {
  try {
    const address = req.body.address
    let result = []
    await Axios.get('http://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=' + address + '&startblock=0&endblock=999999999&sort=desc&apikey=' + process.env.ETHERSCAN_API)
      .then((re) => result = re.data.result)
    res.status(200).json({ result })
  }
  catch (error) {
    // logger.error(e)
    res.status(500).send({ error })
  }
}

export const viewBalance = async (req, res) => {
  try {
    const address = req.body.address
    var balance = await contract.methods.balanceOf(address).call()

    res.status(200).json({ balance })
  }
  catch (error) {
    // logger.error(e)
    res.status(500).send({ error })
  }
}

export const transaction = async (req, res) => {
  try {
    const key = req.body.key
    // const from = req.body.from
    const toAddress = req.body.to
    const tokenAddress = process.env.CONTRACT_ADDRESS
    const fromAddress = req.body.from
    var transferAmount = req.body.amount
    var gasPriceGwei = 3;
    var gasLimit = 1000000;
    var count = await web3.eth.getTransactionCount(fromAddress);
    var rawTransaction = {
      "from": fromAddress,
      "to": tokenAddress,
      "nonce": "0x" + count.toString(16),
      "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
      "gasLimit": web3.utils.toHex(gasLimit),
      "value": "0x0",
      "data": contract.methods.transfer(toAddress, transferAmount).encodeABI(),
    };
    var privKey = new Buffer.from(key, 'hex');
    var tx = new Tx(rawTransaction, { chain: 'rinkeby' })
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then((res) => console.log(res))
      .catch((err) => console.log(err))
    // console.log(receipt)
    // console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
    // res.status(200).json({ result: receipt })
    res.status(200).send()

  }
  catch (error) {
    // logger.error(e)
    res.status(500).json({ error })
  }
  // 4715.15
}
export const getOneUser = async (req, res) => {
  try {
    const user = await ThunderUser.findOne({
      address: req.body.address
    })
    user.address = user.address.toUpperCase()
    console.log(user)
    if (user)
      res.status(200).json({ user })
    else
      res.status(404).send('User not Found')
  }
  catch (err) {
    res.status(500).json(err);
  }
}