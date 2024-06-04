import express from "express";
import { globalRouter } from "./router/globalRouter";
import { userRouter } from "./router/userRouter";
import { musicRouter } from "./router/musicRouter";
import cors from "cors";
import { playlistRouter } from "./router/playlistRouter";

const app = express();

app.use(express.urlencoded({ extended: true })); //req.body 사용시 필요
app.use(express.json());

// app.use(function (req, res) {
//   res.header("Access-Control-Allow-Origin", "https://cedarsojt.store");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
// });

app.use(cors());

app.use("/", globalRouter);
app.use("/music", musicRouter);
app.use("/user", userRouter);
app.use("/playlist", playlistRouter);

export default app;
