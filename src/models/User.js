import mongoose from "mongoose";
import Music from "./Music";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  admin: { type: Boolean, required: true },
  playList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
