import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: String,
  mobile: { type: Number, unique: true },
  pin: { type: Number, maxlength: 4 },
  image: { type: String },
  token: { type: String },
  key: { type: String },
  address: { type: String }
});

const ThunderUser = new mongoose.model("ThunderUser", userSchema);

export default ThunderUser;
