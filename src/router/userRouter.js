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

userRouter.get("/:id/playlist", getUserPlaylist);
userRouter.post("/:id/create-playlist", postUserPlaylist);
userRouter.post("/:id/addPlaylist", postAddUserPlaylist);
userRouter.post("/:id/deletePlaylist", postDeleteUserPlaylist);
userRouter.get("/:id", getUser);
