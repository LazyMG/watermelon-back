import express from "express";
import {
  getMusic,
  getMusicList,
  postMusic,
  testGetAllMusics,
} from "../controller/musicController";

export const musicRouter = express.Router();

musicRouter.get("/allMusic", testGetAllMusics);
musicRouter.get("/list", getMusicList);
musicRouter.route("/:musicId").get(getMusic);
