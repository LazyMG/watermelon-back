import express from "express";
import {
  musicDelete,
  musicDetail,
  musicEdit,
} from "../controller/musicController";

export const musicRouter = express.Router();

musicRouter.get("/:id", musicDetail);
musicRouter.get("/:id/edit", musicEdit);
musicRouter.get("/:id/delete", musicDelete);
