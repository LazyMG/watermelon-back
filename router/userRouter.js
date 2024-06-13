import express from "express";
import {
  editUser,
  getUser,
  getUserPlaylist,
  postAddUserPlaylist,
  postDeleteUserPlaylist,
  postUserPlaylist,
} from "../controller/userController";

export const userRouter = express.Router();

userRouter.get("/session", async (req, res) => {
  //console.log(req.session);
  if (req.session.loggedIn) {
    return res
      .status(200)
      .json({ message: "Auth Confirm", ok: true, user: req.session.user });
  }
  return res.json({ message: "No Auth", ok: false });
});
userRouter.get("/userCheck", (req, res) => {
  if (req.session.user) {
    console.log("login!");
  } else {
    console.log("fail!");
  }
  return res.end();
});
userRouter.get("/:id/playlist", getUserPlaylist);
userRouter.post("/:id/create-playlist", postUserPlaylist);
userRouter.post("/:id/addPlaylist", postAddUserPlaylist);
userRouter.post("/:id/deletePlaylist", postDeleteUserPlaylist);
userRouter.route("/:id").get(getUser).patch(editUser);
