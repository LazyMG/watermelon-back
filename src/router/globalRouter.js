import express from "express";
import {
  getSearchResult,
  postAlbumToArtist,
  postMusicToAlbum,
  postMusicToArtist,
} from "../controller/globalController";
import {
  getLogout,
  postCreateAccount,
  postGoogleLogin,
  postLogin,
} from "../controller/userController";
import {
  getNoAlbumMusic,
  getNoArtistMusic,
  postMusic,
} from "../controller/musicController";
import { getArtists, postArtist } from "../controller/artistController";
import {
  getAlbums,
  getNoArtistAlbum,
  postAlbum,
} from "../controller/albumController";

export const globalRouter = express.Router();

globalRouter.post("/upload/music", postMusic);
globalRouter.post("/upload/artist", postArtist);
globalRouter.post("/upload/album", postAlbum);

globalRouter.get("/connect/artist", getArtists);

globalRouter.get("/connect/artistMusic", getNoArtistMusic);
globalRouter.post("/connect/artistMusic", postMusicToArtist);

globalRouter.get("/connect/artistAlbum", getNoArtistAlbum);
globalRouter.post("/connect/artistAlbum", postAlbumToArtist);

globalRouter.get("/connect/album", getAlbums);

globalRouter.get("/connect/albumMusic", getNoAlbumMusic);
globalRouter.post("/connect/albumMusic", postMusicToAlbum);

globalRouter.get("/search", getSearchResult);

globalRouter.post("/login", postLogin);

globalRouter.get("/logout", getLogout);

globalRouter.post("/create-account", postCreateAccount);

globalRouter.post("/google-login", postGoogleLogin);
