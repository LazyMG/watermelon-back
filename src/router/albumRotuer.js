import express from "express";
import { getAlbum } from "../controller/albumController";

export const albumRouter = express.Router();

albumRouter.get("/:albumId", getAlbum);
