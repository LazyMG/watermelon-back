import mongoose from "mongoose";
import Artist from "./Artist";
import Album from "./Album";

const musicSchema = new mongoose.Schema({
  title: { type: String, require: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" }, //Artist
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  coverImg: String,
  ytId: { type: String, require: true, unique: true },
  meta: {
    views: { type: Number, default: 0 },
    liked: { type: Number, default: 0 },
  },
  genre: { type: String, require: true }, //힙합, 발라드, 댄스
  duration: { type: String, require: true },
});

const NewMusic = mongoose.model("NewMusic", musicSchema);
export default NewMusic;
