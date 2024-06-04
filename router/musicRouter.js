import express from "express";
import {
  getMusic,
  getMusicList,
  postMusic,
} from "../controller/musicController";

export const musicRouter = express.Router();

musicRouter.get("/list", getMusicList);
musicRouter.route("/:id").get(getMusic).post(postMusic);
