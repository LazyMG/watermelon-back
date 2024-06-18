import express from "express";
import { globalRouter } from "./router/globalRouter";
import { userRouter } from "./router/userRouter";
import { musicRouter } from "./router/musicRouter";
import cors from "cors";
import { playlistRouter } from "./router/playlistRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
import { albumRouter } from "./router/albumRotuer";
import { aritstRouter } from "./router/artistRouter";

const app = express();

app.use(express.urlencoded({ extended: true })); //req.body 사용시 필요
app.use(express.json());

// app.use(
//   cors({
//     origin: process.env.FRONT_URL,
//     credentials: true,
//   })
// );

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", process.env.FRONT_URL);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

// app.use(
//   session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.DB_URL_MONGO,
//       ttl: 1 * 24 * 60 * 60, // 14 days expiration (you can adjust this)
//       autoRemove: "native",
//     }),
//     cookie: {
//       httpOnly: true,
//       secure: true, // Ensure this is true if using HTTPS
//       sameSite: "None", // Cross-site cookie
//     },
//   })
// );

app.use(
  cors({
    origin: "https://watermelon-lmg.netlify.app",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://watermelon-lmg.netlify.app"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL_MONGO,
      ttl: 1 * 24 * 60 * 60,
      autoRemove: "native",
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: "watermelon-back-lmg.fly.dev",
    },
    proxy: true,
  })
);

app.use("/music", musicRouter);
app.use("/user", userRouter);
app.use("/playlist", playlistRouter);
app.use("/album", albumRouter);
app.use("/artist", aritstRouter);
app.use("/", globalRouter);

export default app;
