import mongoose from "mongoose";
import Artist from "./Artist";
import NewMusic from "./NewMusic";

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
  },
  musicList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewMusic",
    },
  ],
  releasedDate: { type: String, required: true },
  duration: { type: String, required: true },
  overview: String,
  coverImg: { type: String, required: true },
  isComplete: { type: Boolean, default: false },
  totalMusic: { type: Number, required: true },
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
