import Album from "../models/Album";
import Artist from "../models/Artist";
import NewMusic from "../models/NewMusic";
import NewUser from "../models/NewUser";

//musicRouter - Home.jsx - getMusics
//해당 페이지에서 모든 노래 GET
export const getAllMusics = async (req, res) => {
  let musics = [];

  try {
    musics = await NewMusic.find({})
      .limit(20)
      .populate({
        path: "artist",
        select: "_id artistName", // artist에서 _id와 title만 선택
      })
      .populate({
        path: "album",
        select: "_id title releasedDate category", // album에서 _id와 title, releasedDate, category만 선택
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  return res.status(200).json({ message: "All Musics", musics, ok: true });
};

//globalRouter - AlbumMusic.jsx - getMusics
//해당 페이지에서 앨범 정보가 없는 노래들 GET
//데이터 형식 맞추기
export const getNoAlbumMusic = async (req, res) => {
  let musicsWithoutAlbum;
  try {
    musicsWithoutAlbum = await NewMusic.find({ album: { $exists: false } });
  } catch (error) {
    console.log(error);
    //수정 필요
    return res.send("error");
  }
  //수정 필요
  return res.json(musicsWithoutAlbum);
};

//musicRouter - X
export const getMusicList = (req, res) => {
  return res.send("getMusicList");
};

//musicRouter - Watch.jsx - getMusic
//해당 페이지에서 id에 맞는 노래 GET
//데이터 형식 맞추기
export const getMusic = async (req, res) => {
  const { musicId } = req.params;
  let music = {};

  try {
    music = await NewMusic.findById(musicId);
  } catch (error) {
    console.log(error);
    //수정 필요
    return res.send("error");
  }

  //수정 필요
  return res.json(music);
};

//globalRouter - ArtistMusic.jsx - getMusics
//해당 페이지에서 가수 정보가 없는 노래들 GET
//데이터 형식 맞추기
export const getNoArtistMusic = async (req, res) => {
  let musicsWithoutArtist;

  try {
    musicsWithoutArtist = await NewMusic.find({ artist: { $exists: false } });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }
  //수정 필요
  return res.json(musicsWithoutArtist);
};

//globalRouter - UploadMusic.jsx - onValid
//해당 페이지에서 사용자 입력에 따른 정보 POST
//데이터 형식 맞추기
export const postMusic = async (req, res) => {
  const { title, coverImg, ytId, genre, duration } = req.body;

  await NewMusic.create({
    title,
    coverImg,
    ytId,
    genre,
    duration,
  });

  //수정 필요
  return res.status(200).send("Success");
};

//musicRouter - SmallMusics.jsx - clickPlayMusic
export const addMusicViews = async (req, res) => {
  const { musicId } = req.params;

  try {
    const music = await NewMusic.findByIdAndUpdate(
      musicId,
      { $inc: { "meta.views": 1 } }, // views 값을 1 증가
      { new: true } // 업데이트 후의 문서를 반환
    );

    if (!music) {
      return res.status(404).json({ message: "No Music", ok: false });
    }

    res.status(200).json({ message: "View count increased", ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "DB error", ok: false });
  }
};

//musicRouter
export const updateMusicLikes = async (req, res) => {
  const { like } = req.body;
  const { musicId } = req.params;

  try {
    const music = await NewMusic.findByIdAndUpdate(
      musicId,
      { $inc: { "meta.liked": like ? 1 : -1 } },
      { new: true }
    );
    if (!music) {
      return res.status(404).json({ message: "No Music", ok: false });
    }
    if (music.meta.liked < 0) {
      music.meta.liked = 0; // 값을 0으로 설정
      await music.save(); // 변경사항을 저장
    }
    res.status(200).json({ message: "Like count update", ok: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }
};

export const getMusicIsLike = async (req, res) => {
  const { musicId } = req.params;
  const userId = req.session.user?.userId;

  let isLike = false;

  try {
    const user = await NewUser.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "DB Error | No User", isLike, ok: false });
    isLike = user.likedMusic.includes(musicId);
    return res.status(200).json({ message: "isLike", isLike, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", isLike, ok: false });
  }
};
