import express from "express";
import { home, search } from "../controller/globalController";
import { upload } from "../controller/musicController";
import { login, logout, profile } from "../controller/userController";

export const globalRouter = express.Router();

globalRouter.get("/", home);

globalRouter.get("/search", search);

globalRouter.get("/upload", upload);

globalRouter.get("/profile", profile);

globalRouter.get("/login", login);

globalRouter.get("/logout", logout);
