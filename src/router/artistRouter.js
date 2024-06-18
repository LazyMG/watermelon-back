import express from "express";
import { getArtist } from "../controller/artistController";

export const aritstRouter = express.Router();

aritstRouter.get("/:artistId", getArtist);
