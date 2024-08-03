import Album from "../models/Album";

//globalRouter - ArtistAlbum.jsx - getAlbums
//해당 페이지에서 가수 정보가 없는 앨범 GET
//데이터 형식 맞추기
export const getNoArtistAlbum = async (req, res) => {
  let albumsWithoutArtist;

  try {
    albumsWithoutArtist = await Album.find({ artist: { $exists: false } });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  //수정 필요
  return res.json(albumsWithoutArtist);
};

//globalRouter - ConnectAlbum.jsx - getAlbums
//해당 페이지에서 총 곡 수를 채우지 못한 앨범들 GET
//데이터 형식 맞추기
export const getAlbums = async (req, res) => {
  let albums;

  try {
    albums = await Album.find({ isComplete: false });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  //수정 필요
  return res.json(albums);
};

//globalRouter - UploadAlbum.jsx - onValid
//해당 페이지에서 사용자 입력에 따른 정보 POST
//데이터 형식 맞추기
export const postAlbum = async (req, res) => {
  const {
    title,
    coverImg,
    releasedDate,
    duration,
    overview,
    totalMusic,
    category,
  } = req.body;

  try {
    await Album.create({
      title,
      coverImg,
      releasedDate,
      duration,
      overview,
      totalMusic,
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  //수정 필요
  return res.status(200).send("Success");
};

//albumRouter - AlbumMusic.jsx - getAlbum
//해당 페이지에서 id에 맞는 앨범 GET
//데이터 형식 맞추기
export const getAlbum = async (req, res) => {
  const { albumId } = req.params;

  let album;

  try {
    album = await Album.findById(albumId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }
  //수정 필요
  return res.status(200).json(album);
};
