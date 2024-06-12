import express from "express";
import {
  editUser,
  getUser,
  getUserPlaylist,
  postUserPlaylist,
} from "../controller/userController";

export const userRouter = express.Router();

userRouter.get("/session", async (req, res) => {
  console.log(req.session);
  if (req.session.isLoggedIn) {
    return res
      .status(200)
      .json({ message: "Auth Confirm", ok: true, userId: req.session.userId });
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
userRouter.route("/:id").get(getUser).patch(editUser);
