import express from "express";
import {
  deletePlaylist,
  getPlaylist,
  postPlaylist,
} from "../controller/playlistController";

export const playlistRouter = express.Router();

playlistRouter.get("/:id", getPlaylist);
playlistRouter.post("/:id", postPlaylist);
playlistRouter.post("/delete/:id", deletePlaylist);
