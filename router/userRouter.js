import express from "express";
import { editUser, getUser } from "../controller/userController";

export const userRouter = express.Router();

userRouter.route("/:id").get(getUser).patch(editUser);
