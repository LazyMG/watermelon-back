import Artist from "../models/Artist";
import NewMusic from "../models/NewMusic";
import Album from "../models/Album";
import mongoose from "mongoose";

//수정 필요 - 검색어에 따른 노래, 가수, 앨범 모두 가져오는 걸로
//globalRouter - Search.jsx - getResults
//해당 페이지에서 검색어에 맞는 데이터 GET
//데이터 맞추기
export const getSearchResult = async (req, res) => {
  const { keyword } = req.query;

  let musics = [];
  let artists = [];
  let albums = [];

  try {
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

  //수정 필요
  return res
    .status(200)
    .json({ message: "Search", data: { musics, artists, albums }, ok: true });
};

//globalRouter - ArtistMusic.jsx - postMusicToArtist
//가수와 노래를 연결 POST
//데이터 형식 맞추기
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
  //수정 필요
  return res.status(200).send("Success");
};

//globalRouter - ArtistAlbum.jsx - postAlbumToArtist
//가수와 앨범을 연결 POST
//데이터 형식 맞추기
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
  //수정 필요
  return res.status(200).send("Success");
};

//globalRouter - AlbumMusic.jsx - postMusicToAlbum
//노래와 앨범을 연결 POST
//데이터 형식 맞추기
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
  //수정 필요
  return res.status(200).send("Success");
};
