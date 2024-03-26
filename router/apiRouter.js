import express from "express";
import { addList, removeList } from "../controller/musicController";

export const apiRouter = express.Router();

apiRouter.post("/addList", addList);
apiRouter.post("/removeList", removeList);
