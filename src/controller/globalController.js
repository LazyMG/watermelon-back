import Artist from "../models/Artist";
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
