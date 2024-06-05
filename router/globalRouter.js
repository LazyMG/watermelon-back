import express from "express";
import {
  getAlbums,
  getArtist,
  getArtists,
  getNoArtistMusic,
  getSearchResult,
  postAlbum,
  postArtist,
  postMusicToArtist,
  testArtistUpload,
  testConnectArtistToMusic,
  testMusicUpload,
} from "../controller/globalController";
import {
  getLogout,
  postCreateAccount,
  postGoogleLogin,
  postLogin,
} from "../controller/userController";
import { getArtistMusic, postMusic } from "../controller/musicController";

export const globalRouter = express.Router();

globalRouter.get("/", (req, res) => res.send("home"));

globalRouter.post("/upload/music", postMusic);
globalRouter.post("/upload/artist", postArtist);
globalRouter.post("/upload/album", postAlbum);
globalRouter.get("/artist/:artistId", getArtist);

globalRouter.get("/connect/artist", getArtists);
globalRouter.get("/connect/artistMusic", getNoArtistMusic);
globalRouter.post("/connect/artistMusic", postMusicToArtist);

globalRouter.get("/connect/album", getAlbums);

globalRouter.post("/testMusicUpload", testMusicUpload);

globalRouter.post("/testArtistUpload", testArtistUpload);

globalRouter.post("/testConnectArtistToMusic", testConnectArtistToMusic);

globalRouter.get("/testNoArtistMusic", getNoArtistMusic);

globalRouter.get("/search", getSearchResult);

globalRouter.post("/login", postLogin);

globalRouter.get("/logout", getLogout);

globalRouter.post("/create-account", postCreateAccount);

globalRouter.post("/google-login", postGoogleLogin);
