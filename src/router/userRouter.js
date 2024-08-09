import express from "express";
import {
  getRecentMusics,
  getSession,
  getUser,
  getUserAllPlaylists,
  getUserPlaylist,
  postAddUserPlaylist,
  postAddUserRecentMusic,
  postDeleteUserPlaylist,
  postUserPlaylist,
} from "../controller/userController";
import { get } from "mongoose";

export const userRouter = express.Router();

userRouter.get("/session", getSession);

userRouter.get("/:userId/playlist", getUserPlaylist);
userRouter.get("/:userId/all-playlists", getUserAllPlaylists);
userRouter.post("/:userId/create-playlist", postUserPlaylist);
userRouter.post("/:userId/addPlaylist", postAddUserPlaylist);
userRouter.post("/:userId/deletePlaylist", postDeleteUserPlaylist);
userRouter.get("/:userId", getUser);
userRouter.post("/:userId/add-recentMusic", postAddUserRecentMusic);
userRouter.get("/:userId/getRecentMusics", getRecentMusics);
