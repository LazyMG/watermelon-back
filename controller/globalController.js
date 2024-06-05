import Artist from "../models/Artist";
import Music from "../models/Music";
import NewMusic from "../models/NewMusic";
import Album from "../models/Album";
import { v4 as uuidv4 } from "uuid";

export const getSearchResult = async (req, res) => {
  return res.send("getSearchResult");
};

export const getArtist = async (req, res) => {
  const { artistId } = req.params;

  let artist;

  try {
    artist = await Artist.findById(artistId);
  } catch (error) {
    console.log(error);
    return res.status(404).send("Failed");
  }
  return res.json(artist);
};

export const postMusicToArtist = async (req, res) => {
  const { artistId, musicId } = req.body;
  return res.status(200).send("Success");
};

export const postArtist = async (req, res) => {
  console.log(req.body);
  const { artistName, debutDate, imgUrl } = req.body;

  await Artist.create({
    artistName,
    imgUrl,
    debutDate,
    id: uuidv4(),
  });

  return res.status(200).send("Success");
};

export const getArtists = async (req, res) => {
  let artists;

  try {
    artists = await Artist.find({});
  } catch (error) {
    console.log(error);
    return res.status(404).send("Failed");
  }
  return res.json(artists);
};

export const getAlbums = async (req, res) => {
  let albums;

  try {
    albums = await Album.find({});
  } catch (error) {
    console.log(error);
    return res.status(404).send("Failed");
  }
  return res.json(albums);
};

export const postAlbum = async (req, res) => {
  console.log(req.body);
  const { title, coverImg, releasedDate, duration, overview } = req.body;

  await Album.create({
    title,
    coverImg,
    releasedDate,
    duration,
    overview,
    id: uuidv4(),
  });

  return res.status(200).send("Success");
};

export const testMusicUpload = async (req, res) => {
  const title = "testMusic3";
  const coverImg = "testCoverImg3";
  const ytId = "testYtId3";
  const genre = "testGenre3";
  const duration = "testDuration3";

  try {
    await NewMusic.create({
      title,
      coverImg,
      ytId,
      genre,
      duration,
    });
  } catch (error) {
    console.log(error);
    return res.send("error");
  }

  return res.redirect("/");
};

export const testArtistUpload = async (req, res) => {
  const artistname = "testArtistName";
  const debutDate = "testDebutDate";
  const id = "1234";

  try {
    await Artist.create({
      artistname,
      debutDate,
      id,
    });
  } catch (error) {
    console.log(error);
    return res.send("error");
  }
  return res.redirect("/");
};

export const testConnectArtistToMusic = async (req, res) => {
  let artist;
  let music;

  try {
    artist = await Artist.findOne({
      id: "1234",
    });
    music = await NewMusic.findOneAndUpdate(
      { ytId: "testYtId" },
      { artist: artist._id }
    );
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
  return res.json(music);
};

export const getNoArtistMusic = async (req, res) => {
  let musicsWithoutArtist;
  try {
    musicsWithoutArtist = await NewMusic.find({ artist: { $exists: false } });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
  return res.json(musicsWithoutArtist);
};

export const home = async (req, res) => {
  console.log("home");
  //음악들 불러오기
  const allMusics = await Music.find({});
  const recentMusics = allMusics.sort(() => 0.5 - Math.random()).slice(0, 6);
  const recommendMusics = allMusics
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);
  //console.log(recentMusics, recommendMusics);
  return res.json(allMusics);
};
