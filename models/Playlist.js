import mongoose from "mongoose";
import NewMusic from "./NewMusic";
import NewUser from "./NewUser";

const playlistSchema = new mongoose.Schema({
  title: { type: String, require: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "NewUser" },
  list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewMusic",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  id: { type: String, require: true, unique: true },
});

const PlayList = mongoose.model("Playlist", playlistSchema);
export default PlayList;
