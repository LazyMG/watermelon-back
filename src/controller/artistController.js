import Artist from "../models/Artist";

//globalRouter - ConnectArtist.jsx - getArtists
//해당 페이지에서 모든 가수 정보 GET
//데이터 형식 맞추기
export const getArtists = async (req, res) => {
  let artists;

  //페이지네이션 고려

  try {
    artists = await Artist.find({});
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Erorr", ok: false });
  }

  //수정 필요
  return res.json(artists);
};

//aritstRouter - ArtistAblum.jsx - getArtist
//해당 페이지에서 id에 맞는 가수 정보 GET
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

//globalRouter - UploadArtist.jsx - onValid
//해당 페이지에서 사용자 입력에 따른 정보 POST
//데이터 형식 맞추기
export const postArtist = async (req, res) => {
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

  //수정 필요
  return res.status(200).send("Success");
};
