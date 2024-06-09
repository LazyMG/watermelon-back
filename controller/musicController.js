import Album from "../models/Album";
import Artist from "../models/Artist";
import NewMusic from "../models/NewMusic";
import NewUser from "../models/NewUser";

export const testGetAllMusics = async (req, res) => {
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

//music에 album 추가
//album의 list에 music 추가
export const postMusicToAlbum = async (req, res) => {
  const { albumId, musicId } = req.body;

  try {
    await NewMusic.findByIdAndUpdate(musicId, {
      album: albumId,
    });
    const album = await Album.findByIdAndUpdate(albumId, {
      $push: { musicList: musicId },
    });
    if (album.musicList.length === album.totalMusic) {
      await album.updateOne({ isComplete: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send("Failed");
  }
  return res.status(200).send("Success");
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
  console.log(music);
  return res.json(music);
};

export const getArtistMusic = async (req, res) => {};

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
