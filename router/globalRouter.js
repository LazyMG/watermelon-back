import express from "express";
import { getSearchResult } from "../controller/globalController";
import {
  getLogout,
  postCreateAccount,
  postGoogleLogin,
  postLogin,
} from "../controller/userController";

export const globalRouter = express.Router();

globalRouter.get("/", (req, res) => res.send("home"));

globalRouter.get("/search", getSearchResult);

globalRouter.post("/login", postLogin);

globalRouter.get("/logout", getLogout);

globalRouter.post("/create-account", postCreateAccount);

globalRouter.post("/google-login", postGoogleLogin);
