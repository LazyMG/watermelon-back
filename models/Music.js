import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  title: { type: String, require: true },
  titleEng: { type: String, default: "" },
  singer: { type: String, require: true },
  singerEng: { type: String, default: "" },
  albumTitle: { type: String, require: true },
  albumTitleEng: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  coverImg: String,
  ytId: { type: String, default: "" },
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

const Music = mongoose.model("Music", musicSchema);
export default Music;
