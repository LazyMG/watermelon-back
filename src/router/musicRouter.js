import express from "express";
import {
  addMusicViews,
  getAllMusics,
  getMusic,
  getMusicList,
  updateMusicLikes,
} from "../controller/musicController";

export const musicRouter = express.Router();

musicRouter.get("/allMusic", getAllMusics);
musicRouter.get("/list", getMusicList);
musicRouter.get("/:musicId", getMusic);
musicRouter.patch("/:musicId/add-views", addMusicViews);
musicRouter.post("/:musicId/updateMusicLike", updateMusicLikes);
