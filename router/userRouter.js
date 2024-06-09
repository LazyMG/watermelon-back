import express from "express";
import {
  editUser,
  getUser,
  getUserPlaylist,
  postUserPlaylist,
} from "../controller/userController";

export const userRouter = express.Router();

userRouter.get("/:id/playlist", getUserPlaylist);
userRouter.route("/:id").get(getUser).patch(editUser);
userRouter.post("/:id/create-playlist", postUserPlaylist);
