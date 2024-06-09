import NewMusic from "../models/NewMusic";
import PlayList from "../models/Playlist";

export const getPlaylistList = (req, res) => {
  return res.send("getPlaylistList");
};

export const postPlaylist = async (req, res) => {
  const { musicId } = req.body;
  const { id } = req.params;

  try {
    await PlayList.findByIdAndUpdate(id, {
      $push: { list: musicId },
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error" });
  }
  return res.status(200).json({ message: "Add Music" });
};

export const editPlaylist = (req, res) => {
  return res.send("editPlaylist");
};

export const deletePlaylist = (req, res) => {
  return res.send("deletePlaylist");
};

export const getPlaylist = async (req, res) => {
  const { id } = req.params;

  let playlist;

  try {
    //playlist = await PlayList.findById(id).populate("list");
    playlist = await PlayList.findById(id).populate({
      path: "list",
      populate: [
        { path: "artist", select: "_id artistName" },
        { path: "album", select: "_id title" },
      ],
    });
    //console.log(playlist);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error" });
  }

  return res.status(200).json({ message: "Get Playlist", playlist });
};
