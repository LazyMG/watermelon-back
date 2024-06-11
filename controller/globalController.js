import Artist from "../models/Artist";
import Music from "../models/Music";
import NewMusic from "../models/NewMusic";
import Album from "../models/Album";
import mongoose from "mongoose";

export const getSearchResult = async (req, res) => {
  const { keyword } = req.query;

  let musics = [];
  let artists = [];
  let albums = [];

  try {
    // musics = await NewMusic.find({
    //   title: {
    //     $regex: new RegExp(keyword, "i"),
    //   },
    // })
    //   .populate({
    //     path: "artist",
    //     select: "_id artistName imgUrl", // artist에서 _id와 title만 선택
    //   })
    //   .populate({
    //     path: "album",
    //     select: "_id title coverImg", // album에서 _id와 title만 선택
    //   });
    musics = await NewMusic.find({
      $or: [
        { title: { $regex: new RegExp(keyword, "i") } },
        {
          artist: {
            $in: await Artist.find({
              artistName: { $regex: new RegExp(keyword, "i") },
            }).select("_id"),
          },
        },
        {
          album: {
            $in: await Album.find({
              title: { $regex: new RegExp(keyword, "i") },
            }).select("_id"),
          },
        },
      ],
    })
      .populate({ path: "artist" })
      .populate({ path: "album" });
    artists = await Artist.find({
      artistName: {
        $regex: new RegExp(keyword, "i"),
      },
    })
      .populate({
        path: "musicList",
        select: "_id title coverImg", // artist에서 _id와 title만 선택
      })
      .populate({
        path: "albumList",
        select: "_id title coverImg", // album에서 _id와 title만 선택
      });
    albums = await Album.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    })
      .populate({
        path: "musicList",
        select: "_id title coverImg", // artist에서 _id와 title만 선택
      })
      .populate({
        path: "artist",
        select: "_id artistName imgUrl", // album에서 _id와 title만 선택
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  return res
    .status(200)
    .json({ message: "Search", data: { musics, artists, albums }, ok: true });
};

export const getArtist = async (req, res) => {
  const { artistId } = req.params;

  let artist;

  try {
    artist = await Artist.findById(artistId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }
  return res.status(200).json({ message: "Artist", artist, ok: true });
};

export const getAlbum = async (req, res) => {
  const { albumId } = req.params;

  let album;

  try {
    album = await Album.findById(albumId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }
  return res.status(200).json(album);
};

export const postMusicToArtist = async (req, res) => {
  const { artistId, musicId } = req.body;

  try {
    await NewMusic.findByIdAndUpdate(musicId, {
      artist: artistId,
    });
    await Artist.findByIdAndUpdate(artistId, {
      $push: { musicList: musicId },
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }
  return res.status(200).send("Success");
};

export const getAlbums = async (req, res) => {
  let albums;

  try {
    albums = await Album.find({ isComplete: false });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }
  return res.json(albums);
};

export const postAlbumToArtist = async (req, res) => {
  const { artistId, albumId } = req.body;

  try {
    await Album.findByIdAndUpdate(albumId, {
      artist: artistId,
    });
    await Artist.findByIdAndUpdate(artistId, {
      $push: { albumList: albumId },
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }
  return res.status(200).send("Success");
};

export const postArtist = async (req, res) => {
  console.log(req.body);
  const { artistName, debutDate, imgUrl } = req.body;

  try {
    await Artist.create({
      artistName,
      imgUrl,
      debutDate,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  return res.status(200).send("Success");
};

export const getArtists = async (req, res) => {
  let artists;

  try {
    artists = await Artist.find({});
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  return res.json(artists);
};

export const getNoArtistAlbum = async (req, res) => {
  let albumsWithoutArtist;

  try {
    albumsWithoutArtist = await Album.find({ artist: { $exists: false } });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  return res.json(albumsWithoutArtist);
};

export const postAlbum = async (req, res) => {
  const {
    title,
    coverImg,
    releasedDate,
    duration,
    overview,
    totalMusic,
  } = req.body;

  try {
    await Album.create({
      title,
      coverImg,
      releasedDate,
      duration,
      overview,
      totalMusic,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  return res.status(200).send("Success");
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
