import Album from "../models/Album";
import NewMusic from "../models/NewMusic";
import NewUser from "../models/NewUser";
import PlayList from "../models/Playlist";

//playListRouter - AddMusicPlaylistForm.jsx - clickAddMusicPlaylist
//사용자에 입력에 따른 재생목록 생성 POST
//데이터 형식 맞추기
export const postPlaylist = async (req, res) => {
  const { musicId } = req.body;
  const { playlistId } = req.params;

  try {
    await PlayList.findByIdAndUpdate(playlistId, {
      $push: { list: musicId },
    });
  } catch (error) {
    console.log(error);
    //수정 필요
    return res.status(404).json({ message: "DB Error" });
  }
  //수정 필요
  return res.status(200).json({ message: "Add Music" });
};

// X
//재생 목록 이름 바꾸기 등으로 활용
export const editPlaylist = (req, res) => {
  return res.send("editPlaylist");
};

//playListRouter - Playlist.jsx - clickDeletePlaylist
//해당 id에 맞는 플레이 리스트 삭제 POST
//데이터 형식 맞추기
export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { userId } = req.body;

  try {
    await NewUser.findByIdAndUpdate(
      userId,
      { $pull: { playlists: playlistId } },
      { new: true }
    );
    await PlayList.findByIdAndDelete(playlistId);
  } catch (error) {
    console.log(error);
    //수정 필요
    return res.status(404).json({ message: "DB Error" });
  }
  return res.status(200).json({ message: "Playlist Delete", ok: true });
};

//playListRouter - Playlist.jsx - getPlaylist
//재생목록 또는 앨범 정보 GET
export const getPlaylist = async (req, res) => {
  const { playlistId } = req.params;

  const userId = req.session.user?.userId;

  let playlist;
  let isAlbum = false;
  let user;
  let isUserHasPlaylist = false;

  try {
    //재생목록일 때
    playlist = await PlayList.findById(playlistId).populate({
      path: "list", //재생목록의 음악 정보에 따른
      populate: [
        { path: "artist", select: "_id artistName" }, //가수 id와 가수명
        { path: "album", select: "_id title" }, //앨범 id와 앨범명
      ],
    });
    //앨범일 때
    if (!playlist) {
      playlist = await Album.findById(playlistId)
        .populate({
          path: "musicList", //앨범의 음악 정보에 따른
          populate: [
            { path: "artist", select: "_id artistName" }, //가수 id와 가수명
            { path: "album", select: "_id title" }, //앨범 id와 앨범명
          ],
        })
        .populate({ path: "artist" });
      isAlbum = true;
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  try {
    //로그인 한 사용자일 때
    if (userId) {
      user = await NewUser.findById(userId)
        .populate("playlists")
        .populate("albums");

      //isAlbum을 사용하면 더 좋지 않을까?

      const userPlaylists = user.playlists;
      //현재 재생목록이 사용자가 저장한 것인지 확인
      isUserHasPlaylist = userPlaylists.some(
        (list) => list._id.toString() === playlist._id.toString()
      );

      //현재 앨범이 사용자가 저장한 것인지 확인
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

  return res.status(200).json({
    message: "Get Playlist",
    playlist,
    isAlbum,
    ok: true,
    isUserHasPlaylist,
  });
};
