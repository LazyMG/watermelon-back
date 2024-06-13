import Album from "../models/Album";
import NewMusic from "../models/NewMusic";
import NewUser from "../models/NewUser";
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

export const deletePlaylist = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    await PlayList.findByIdAndDelete(id);
    await NewUser.findByIdAndUpdate(
      userId,
      { $pull: { playlists: id } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error" });
  }
  return res.status(200).json({ message: "Playlist Delete", ok: true });
};

export const getPlaylist = async (req, res) => {
  const { id } = req.params;

  const userId = req.session.user?.userId;

  let playlist;
  let isAlbum = false;
  let user;
  let isUserHasPlaylist = false;

  try {
    playlist = await PlayList.findById(id).populate({
      path: "list",
      populate: [
        { path: "artist", select: "_id artistName" },
        { path: "album", select: "_id title" },
      ],
    });
    if (!playlist) {
      playlist = await Album.findById(id)
        .populate({
          path: "musicList",
          populate: [
            { path: "artist", select: "_id artistName" },
            { path: "album", select: "_id title" },
          ],
        })
        .populate({ path: "artist" });
      isAlbum = true;
    }
    //console.log(playlist);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  try {
    if (userId) {
      user = await NewUser.findById(userId)
        .populate("playlists")
        .populate("albums");
      const userPlaylists = user.playlists;
      isUserHasPlaylist = userPlaylists.some(
        (list) => list._id.toString() === playlist._id.toString()
      );

      if (!isUserHasPlaylist) {
        const userAlbums = user.albums;
        isUserHasPlaylist = userAlbums.some(
          (list) => list._id.toString() === playlist._id.toString()
        );
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }
  // console.log("user", user);
  // console.log("playlist", playlist);

  return res.status(200).json({
    message: "Get Playlist",
    playlist,
    isAlbum,
    ok: true,
    isUserHasPlaylist,
  });
};
