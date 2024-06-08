import mongoose from "mongoose";
import NewMusic from "./NewMusic";

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  admin: { type: Boolean, require: false },
  playList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewMusic",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  likedMusic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewMusic",
    },
  ],
  recentMusic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewMusic",
    },
  ],
});

const NewUser = mongoose.model("NewUser", userSchema);
export default NewUser;
