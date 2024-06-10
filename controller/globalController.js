import Artist from "../models/Artist";
import Music from "../models/Music";
import NewMusic from "../models/NewMusic";
import Album from "../models/Album";
import { v4 as uuidv4 } from "uuid";
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
    return res.status(404).send("Failed");
  }
  return res.json(artist);
};

export const getAlbum = async (req, res) => {
  const { albumId } = req.params;

  let album;

  try {
    album = await Album.findById(albumId);
  } catch (error) {
    console.log(error);
    return res.status(404).send("Failed");
  }
  return res.json(album);
};

//music에 artist 추가
//artist의 musics에 music 추가
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
    return res.status(404).send("Failed");
  }
  return res.status(200).send("Success");
};

export const getAlbums = async (req, res) => {
  let albums;

  try {
    albums = await Album.find({ isComplete: false });
  } catch (error) {
    console.log(error);
    return res.status(404).send("Failed");
  }
  return res.json(albums);
};

//album에 artist 추가
//artist의 album에 album 추가
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
    return res.status(404).send("Failed");
  }
  return res.status(200).send("Success");
};

export const postArtist = async (req, res) => {
  console.log(req.body);
  const { artistName, debutDate, imgUrl } = req.body;

  await Artist.create({
    artistName,
    imgUrl,
    debutDate,
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

export const getNoArtistAlbum = async (req, res) => {
  let albumsWithoutArtist;
  try {
    albumsWithoutArtist = await Album.find({ artist: { $exists: false } });
  } catch (error) {
    console.log(error);
    return res.send("error");
  }
  return res.json(albumsWithoutArtist);
};

export const postAlbum = async (req, res) => {
  console.log(req.body);
  const {
    title,
    coverImg,
    releasedDate,
    duration,
    overview,
    totalMusic,
  } = req.body;

  await Album.create({
    title,
    coverImg,
    releasedDate,
    duration,
    overview,
    totalMusic,
  });

  return res.status(200).send("Success");
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
    return res.send("error");
  }
  return res.json(music);
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
