import express from "express";
import {
  deletePlaylist,
  getPlaylist,
  postPlaylist,
} from "../controller/playlistController";

export const playlistRouter = express.Router();

playlistRouter.get("/:playlistId", getPlaylist);
playlistRouter.post("/:playlistId", postPlaylist);
playlistRouter.post("/delete/:playlistId", deletePlaylist);
