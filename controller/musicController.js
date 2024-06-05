import NewMusic from "../models/NewMusic";
import NewUser from "../models/NewUser";

export const getMusicList = (req, res) => {
  return res.send("getMusicList");
};

export const getMusic = (req, res) => {
  return res.send("getMusic");
};

export const getArtistMusic = async (req, res) => {};

export const postMusic = async (req, res) => {
  console.log(req.body);
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
