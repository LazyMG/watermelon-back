import mongoose from "mongoose";
import Artist from "./Artist";
import NewMusic from "./NewMusic";

const albumSchema = new mongoose.Schema({
  title: { type: String, require: true },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
  },
  list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewMusic",
    },
  ],
  releasedDate: { type: String, require: true },
  duration: { type: String, require: true },
  overview: String,
  coverImg: { type: String, require: true },
  isComplete: { type: Boolean, default: false },
  id: { type: String, require: true, unique: true },
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
