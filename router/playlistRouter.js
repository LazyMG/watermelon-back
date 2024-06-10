import express from "express";
import {
  deletePlaylist,
  editPlaylist,
  getPlaylist,
  getPlaylistList,
  postPlaylist,
} from "../controller/playlistController";

export const playlistRouter = express.Router();

playlistRouter.get("/list", getPlaylistList);

playlistRouter.get("/:id", getPlaylist);
playlistRouter.post("/:id", postPlaylist);
playlistRouter.post("/delete/:id", deletePlaylist);

// playlistRouter
//   .route("/:id")
//   .get(getPlaylist)
//   .post(postPlaylist)
//   .patch(editPlaylist)
//   .delete(deletePlaylist);
