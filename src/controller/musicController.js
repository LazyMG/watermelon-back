import Album from "../models/Album";
import Artist from "../models/Artist";
import NewMusic from "../models/NewMusic";
import NewUser from "../models/NewUser";

export const getAllMusics = async (req, res) => {
  let musics = [];

  try {
    // musics = await NewMusic.find({}).limit(20).populate("artist");
    musics = await NewMusic.find({})
      .limit(20)
      .populate({
        path: "artist",
        select: "_id artistName", // artist에서 _id와 title만 선택
      })
      .populate({
        path: "album",
        select: "_id title", // album에서 _id와 title만 선택
      });
  } catch (error) {
    console.log(error);
    return res.send("error");
  }

  return res.json(musics);
};

export const getNoAlbumMusic = async (req, res) => {
  let musicsWithoutAlbum;
  try {
    musicsWithoutAlbum = await NewMusic.find({ album: { $exists: false } });
  } catch (error) {
    console.log(error);
    return res.send("error");
  }
  return res.json(musicsWithoutAlbum);
};

export const getMusicList = (req, res) => {
  return res.send("getMusicList");
};

export const getMusic = async (req, res) => {
  const { musicId } = req.params;
  let music = {};

  try {
    music = await NewMusic.findById(musicId);
  } catch (error) {
    console.log(error);
    return res.send("error");
  }
  //console.log(music);
  return res.json(music);
};

export const getNoArtistMusic = async (req, res) => {
  let musicsWithoutArtist;

  try {
    musicsWithoutArtist = await NewMusic.find({ artist: { $exists: false } });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }
  return res.json(musicsWithoutArtist);
};

export const postMusic = async (req, res) => {
  //console.log(req.body);
  const { title, coverImg, ytId, genre, duration } = req.body;

  await NewMusic.create({
    title,
    coverImg,
    ytId,
    genre,
    duration,
  });

  return res.status(200).send("Success");
};
