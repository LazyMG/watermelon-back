import Album from "../models/Album";

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
