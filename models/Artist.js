import mongoose from "mongoose";
import Album from "./Album";
import NewMusic from "./NewMusic";

const artistSchema = new mongoose.Schema({
  artistName: { type: String, required: true },
  debutDate: { type: String, required: true },
  albumList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
  musicList: [{ type: mongoose.Schema.Types.ObjectId, ref: "NewMusic" }],
  imgUrl: String,
});

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;
