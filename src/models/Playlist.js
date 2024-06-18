import mongoose from "mongoose";
import NewMusic from "./NewMusic";
import NewUser from "./NewUser";

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "NewUser" },
  list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewMusic",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  overview: { type: String, required: true },
});

const PlayList = mongoose.model("Playlist", playlistSchema);
export default PlayList;
