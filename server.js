import express from "express";
import { globalRouter } from "./router/globalRouter";
import { userRouter } from "./router/userRouter";
import { musicRouter } from "./router/musicRouter";
import cors from "cors";
import { playlistRouter } from "./router/playlistRouter";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

app.use(express.urlencoded({ extended: true })); //req.body 사용시 필요
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL_MONGO,
    }),
  })
);

// app.use(function (req, res) {
//   res.header("Access-Control-Allow-Origin", "https://cedarsojt.store");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
// });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/music", musicRouter);
app.use("/user", userRouter);
app.use("/playlist", playlistRouter);
app.use("/", globalRouter);

export default app;
