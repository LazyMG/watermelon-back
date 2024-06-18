import Artist from "../models/Artist";

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

export const postArtist = async (req, res) => {
  //console.log(req.body);
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
