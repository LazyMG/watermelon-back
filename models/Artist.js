import mongoose from "mongoose";
import Album from "./Album";
import NewMusic from "./NewMusic";

const artistSchema = new mongoose.Schema({
  artistName: { type: String, require: true },
  debutDate: { type: String, require: true },
  album: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
  musics: [{ type: mongoose.Schema.Types.ObjectId, ref: "NewMusic" }],
  id: { type: String, require: true, unique: true }, //백에서 설정
  imgUrl: String,
});

const Artist = mongoose.model("artist", artistSchema);
export default Artist;
