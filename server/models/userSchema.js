import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: String,
  mobile: { type: Number, unique: true },
});

const ThunderUser = new mongoose.model("ThunderUser", userSchema);

export default ThunderUser;
