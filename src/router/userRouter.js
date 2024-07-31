import express from "express";
import {
  getSession,
  getUser,
  getUserPlaylist,
  postAddUserPlaylist,
  postDeleteUserPlaylist,
  postUserPlaylist,
} from "../controller/userController";

export const userRouter = express.Router();

userRouter.get("/session", getSession);

userRouter.get("/:userId/playlist", getUserPlaylist);
userRouter.post("/:userId/create-playlist", postUserPlaylist);
userRouter.post("/:userId/addPlaylist", postAddUserPlaylist);
userRouter.post("/:userId/deletePlaylist", postDeleteUserPlaylist);
userRouter.get("/:userId", getUser);
