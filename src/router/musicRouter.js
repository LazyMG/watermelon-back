import express from "express";
import {
  getAllMusics,
  getMusic,
  getMusicList,
} from "../controller/musicController";

export const musicRouter = express.Router();

musicRouter.get("/allMusic", getAllMusics);
musicRouter.get("/list", getMusicList);
musicRouter.get("/:musicId", getMusic);
