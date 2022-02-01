//jshint version:6

import { } from "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import UserRoute from "./routes/helper.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", UserRoute);

mongoose.connect(`${process.env.MONGODB_URI}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port, function () {
  console.log("server running on port 5000");
});
