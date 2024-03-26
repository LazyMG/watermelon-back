import express from "express";
import { globalRouter } from "./router/globalRouter";
import { userRouter } from "./router/userRouter";
import { musicRouter } from "./router/musicRouter";
import { apiRouter } from "./router/apiRouter";

const app = express();

app.use(express.urlencoded({ extended: true })); //req.body 사용시 필요
app.use(express.json());

app.use("/", globalRouter);
app.use("/music", musicRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;
