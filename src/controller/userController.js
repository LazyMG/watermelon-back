import Album from "../models/Album";
import Artist from "../models/Artist";
import NewMusic from "../models/NewMusic";
import NewUser from "../models/NewUser";
import PlayList from "../models/Playlist";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//userRouter - useAuth.js - useAuth
//현재 세션에 로그인 정보가 있는지 확인 GET
export const getSession = async (req, res) => {
  console.log("auth", req.session);
  if (req.session.loggedIn) {
    return res
      .status(200)
      .json({ message: "Auth Confirm", ok: true, user: req.session.user });
  }
  return res.json({ message: "No Auth", ok: false });
};

//userRouter - Playlist.jsx - clickDeleteUserPlaylist
//사용자가 저장한 재생목록 또는 앨범에서 id에 맞는 재생목록 또는 앨범 삭제 POST
export const postDeleteUserPlaylist = async (req, res) => {
  const { playlistId } = req.body;
  const { userId } = req.params;

  let user;
  let playlist;
  let isPlaylist = true;

  try {
    user = await NewUser.findById(userId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!user) {
    return res.status(404).json({ message: "No User", ok: false });
  }

  try {
    //재생목록일 때
    playlist = await PlayList.findById(playlistId);
    //앨범일 때
    if (!playlist) {
      isPlaylist = false;
      playlist = await Album.findById(playlistId);
    }
  } catch (error) {
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  try {
    //재생목록일 때
    if (isPlaylist) {
      await user.updateOne({
        $pull: { playlists: playlist._id },
      });
    } else {
      //앨범일 때
      await user.updateOne({
        $pull: { albums: playlist._id },
      });
    }
  } catch (error) {
    return res.status(404).json({ message: "DB Error", ok: false });
  }
  return res
    .status(200)
    .json({ message: "Delete Playlist", isUserHasPlaylist: false, ok: true });
};

//userRouter - Playlist.jsx - clickAddUserPlaylist
//id에 맞는 재생목록 또는 앨범을 사용자에게 저장 POST
export const postAddUserPlaylist = async (req, res) => {
  const { playlistId } = req.body;
  const { userId } = req.params;

  let user;
  let playlist;
  let isPlaylist = true;

  try {
    user = await NewUser.findById(userId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!user) {
    return res.status(404).json({ message: "No User", ok: false });
  }

  try {
    //굳이 populate를 해서 모든 정보들을 가여와야 할까?
    //재생목록일 때
    playlist = await PlayList.findById(playlistId).populate("owner"); //사용자 정보 포함
    //앨범일 때
    if (!playlist) {
      isPlaylist = false;
      playlist = await Album.findById(playlistId).populate("artist"); //가수 정보 포함
    }
  } catch (error) {
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  try {
    if (isPlaylist) {
      await user.updateOne({
        $push: { playlists: playlistId },
      });
    } else {
      await user.updateOne({
        $push: { albums: playlistId },
      });
    }
  } catch (error) {
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  return res.status(200).json({
    message: "Add Playlist",
    playlist,
    ok: true,
    isUserHasPlaylist: true,
  });
};

//userRouter - CreatePlaylistForm - onValid
//사용자 입력에 따른 재생 목록 생성 POST
//데이터 형식 맞추기
export const postUserPlaylist = async (req, res) => {
  const { title, overview } = req.body;
  const { userId } = req.params;

  let user;
  let playlist;

  try {
    user = await NewUser.findById(userId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error" });
  }

  if (!user) {
    return res.status(404).json({ message: "No User" });
  }

  try {
    playlist = await PlayList.create({
      title,
      owner: userId,
      overview,
    });
    await user.updateOne({
      $push: { playlists: playlist._id },
    });
  } catch (error) {
    console.log(error);
    //수정 필요
    return res.status(404).json({ message: "DB Error" });
  }
  return res.status(200).json({ message: "Create Playlist", id: playlist._id });
};

//너무 많이 씀, 프론트에서 하나의 함수로 통합하기, 메뉴에 재생목록에는 앨범 제외
//userRouter - AddMusicPlaylistForm.jsx - getUserPlaylist, Layout.jsx - getUserPlaylist, PlaylistContainer.jsx - getUserPlaylist
//사용자의 재생목록 모두 가져오기 GET
//데이터 형식 맞추기
export const getUserPlaylist = async (req, res) => {
  const { userId } = req.params;
  let playlists;
  let albums;
  let user;

  try {
    user = await NewUser.findById(userId)
      .populate({
        path: "playlists", //재생목록 정보에 따른
        populate: {
          //재생목록 생성자의 이름과 id
          path: "owner",
          model: "NewUser",
          select: "username _id",
        },
      })
      .populate({
        path: "albums", //앨범 정보에 따른
        select: "coverImg title _id", //커버이미지와 앨범명과 id
        populate: { path: "artist", model: "Artist", select: "_id artistName" }, //가수 정보에 따른 가수명과 id
      });
    playlists = user.playlists; //재생목록 정보 모두와 재생목록의 생성자의 이름과 생성자의 id
    albums = user.albums; //앨범의 커버이미지와 앨범명과 id, 가수명, 가수 id
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  return res
    .status(200)
    .json({ message: "Playlist", playlists, albums, ok: true });
};

//userRouter - getFunctions.js - getUserAllPlayListQuery
//사용자의 재생목록 모두 가져오기 GET
export const getUserAllPlaylists = async (req, res) => {
  const { userId } = req.params;
  let playlists;
  let albums;
  let user;

  try {
    user = await NewUser.findById(userId)
      .populate({
        path: "playlists", //재생목록 정보에 따른
        populate: {
          //재생목록 생성자의 이름과 id
          path: "owner",
          model: "NewUser",
          select: "username _id",
        },
      })
      .populate({
        path: "albums", //앨범 정보에 따른
        select: "releasedDate category coverImg title _id", //커버이미지와 앨범명과 id
        populate: { path: "artist", model: "Artist", select: "_id artistName" }, //가수 정보에 따른 가수명과 id
      });
    playlists = user.playlists; //재생목록 정보 모두와 재생목록의 생성자의 이름과 생성자의 id
    albums = user.albums; //앨범의 커버이미지와 앨범명과 id, 가수명, 가수 id
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  return res
    .status(200)
    .json({ message: "Playlist", playlists, albums, ok: true });
};

//globalRouter - Layout.jsx - gotoLogout
//로그아웃 GET
//데이터 형식 맞추기
export const getLogout = (req, res) => {
  req.session.destroy();
  //처리

  console.log("삭제후", req.session);

  //수정 필요
  return res.status(200).json({ message: "Logout", action: "delete" });
};

//로그인 방식 고민
//globalRouter - Login.jsx - onValid
//사용자 입력에 따른 로그인 POST
export const postLogin = async (req, res) => {
  const { email, password } = req.body;

  let user;

  try {
    user = await NewUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Login Error" });
    }

    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (!isPasswordRight) {
      return res.status(404).json({
        message: "Login Password Error",
        ok: false,
        type: "USER",
      });
    }
    //이름이랑 아이디
    req.session.loggedIn = true;
    req.session.user = {
      userId: user.id,
      username: user.username,
      admin: user.admin,
    };
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false, type: "DB" });
  }
  console.log("로그인 후", req.session);

  return res.status(200).json({
    message: "Login",
    ok: true,
    user: { userId: user._id, username: user.username, admin: user.admin },
  });
};

//globalRouter - CreateAccount - onValid
//사용자 입력에 따른 계정 생성 POST
export const postCreateAccount = async (req, res) => {
  const { email, username, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return res
      .status(404)
      .json({ message: "Password Error", ok: false, type: "USER" });
  }

  try {
    const emailExists = await NewUser.exists({ email });
    if (emailExists) {
      return res
        .status(404)
        .json({ message: "Email already exists", ok: false, type: "EMAIL" });
    }
  } catch (error) {
    return res.status(404).json({ message: "DB Error", ok: false, type: "DB" });
  }

  let admin;

  if (email === "어드민 이메일") {
    admin = true;
  } else {
    admin = false;
  }
  let encryptedPassword = password;

  try {
    encryptedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Password Hash Error", ok: false, type: "DB" });
  }

  let createdUser;

  try {
    createdUser = await NewUser.create({
      email,
      username,
      password: encryptedPassword,
      admin,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false, type: "DB" });
  }

  // let token;
  // token = jwt.sign({ userId: createdUser.id }, "supersecret_dont_share", {
  //   expiresIn: "1h",
  // });

  return res.status(200).json({ message: "Create Account", ok: true });
};

//userRouter - getFunctions.js - getChannelDataQuery
//사용자 또는 가수의 정보 GET
export const getUser = async (req, res) => {
  const { userId } = req.params;

  let channel;
  let isArtist = false;

  try {
    //사용자일 때
    //좋아요, 최근 노래 다 가져오진 말기
    channel = await NewUser.findById(userId)
      .populate({
        path: "playlists",
        // 필요한 경우 추가적인 필드 선택 가능
      })
      .populate({
        path: "likedMusic",
        options: { limit: 5 },
        select: "title coverImg ytId duration artist album", // 필요한 필드 선택
        populate: [
          {
            path: "artist",
            select: "artistName _id", // artist 필드에서 필요한 정보만 선택
          },
          {
            path: "album",
            select: "title _id", // album 필드에서 필요한 정보만 선택
          },
        ],
      })
      .populate({
        path: "recentMusic",
        options: { limit: 5 },
        select: "title coverImg ytId duration artist album", // 필요한 필드 선택
        populate: [
          {
            path: "artist",
            select: "artistName _id", // artist 필드에서 필요한 정보만 선택
          },
          {
            path: "album",
            select: "title _id category releasedDate", // album 필드에서 필요한 정보만 선택
          },
        ],
      });
    //가수일 때
    if (!channel) {
      channel = await Artist.findById(userId)
        .populate({
          path: "albumList",
          populate: [{ path: "artist", select: "_id artistName" }],
        }) //모든 앨범
        .populate({
          path: "musicList", //가수의 노래 목록 중 5개
          options: { limit: 5 },
          populate: [
            {
              path: "album", //앨범 정보
            },
            {
              path: "artist", //가수 정보, 가수 정보가 필요할까?
            },
          ],
        });
      isArtist = true;
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  return res
    .status(200)
    .json({ message: "Channel Data", channel, isArtist, ok: true });
};

//globalRouter - GoogleLogin.jsx - fetchLoginData
//구글 로그인 POST
export const postGoogleLogin = async (req, res) => {
  const { accessToken } = req.body;

  let info;
  try {
    info = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(404).json({ message: "Login Error", ok: false });
  }

  let exists;

  try {
    exists = await NewUser.exists({ email: info.email });
  } catch (error) {
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  let user;
  let admin;

  if (!exists) {
    if (info.email === "어드민 이메일") {
      admin = true;
    } else {
      admin = false;
    }
    try {
      user = await NewUser.create({
        email: info.email,
        username: info.name,
        password: "/google",
        admin,
      });
    } catch (error) {
      return res.status(404).json({ message: "DB Error", ok: false });
    }
  } else {
    try {
      user = await NewUser.findOne({
        email: info.email,
      });
    } catch (error) {
      return res.status(404).json({ message: "DB Error", ok: false });
    }
  }
  req.session.loggedIn = true;
  req.session.user = {
    userId: user.id,
    username: user.username,
    admin: user.admin,
  };
  return res.status(200).json({
    message: "Login",
    ok: true,
    user: { userId: user._id, username: user.username, admin: user.admin },
  });
};

//userRouter - SmallMusics.jsx - clickPlayMusic, BigMusics.jsx - clickPlayMusic, RowMusics.jsx - clickPlayMusic, Playlist.jsx - clickPlayMusic, Searcj.jsx - clickPlayMusic, Watch.jsx - clickPlayMusic
//음악을 클릭했을 때 사용자의 최근 들은 음악 목록에 추가 POST
//자주 사용함, 함수로 따로 빼야 할 듯
export const postAddUserRecentMusic = async (req, res) => {
  const { musicId } = req.body;
  const { userId } = req.params;

  let user;
  let targetMusic;

  try {
    user = await NewUser.findById(userId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!user) {
    return res.status(404).json({ message: "No User", ok: false });
  }

  try {
    targetMusic = await NewMusic.findById(musicId);
    if (targetMusic) {
      if (!user.recentMusic.includes(targetMusic._id)) {
        // recentMusic 배열에 추가 및 길이 조정
        await user.updateOne({
          $push: {
            recentMusic: {
              $each: [targetMusic._id], // 배열에 추가할 요소
              $slice: -20, // 배열의 길이를 20으로 유지
            },
          },
        });
      }
    } else {
      return res.status(404).json({ message: "No Music", ok: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  return res
    .status(200)
    .json({ message: "Add User Recent Playlist", ok: true });
};

//userRouter - getFunctions.js - getRecentMusicsQuery
export const getRecentMusics = async (req, res) => {
  const { userId } = req.params;

  let user;
  let recentMusics = [];

  try {
    user = await NewUser.findById(userId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!user) {
    return res.status(404).json({ message: "No User", ok: false });
  }

  for (const listMusic of user.recentMusic) {
    try {
      const music = await NewMusic.findById(listMusic._id).populate("artist");
      recentMusics.unshift(music);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: "DB Error", ok: false });
    }
  }

  return res
    .status(200)
    .json({ message: "Recent Musics", recentMusics, ok: true });
};

//userRouter
export const getLikeMusics = async (req, res) => {
  const { userId } = req.params;

  let user;
  let likeMusics = [];

  try {
    user = await NewUser.findById(userId).populate("likedMusic");
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!user) {
    return res.status(404).json({ message: "No User", ok: false });
  }

  for (const listMusic of user.likedMusic) {
    try {
      const music = await NewMusic.findById(listMusic._id).populate("artist");
      likeMusics.unshift(music);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: "DB Error", ok: false });
    }
  }

  return res.status(200).json({ message: "Like Musics", likeMusics, ok: true });
};

//userRouter
export const postLikeMusic = async (req, res) => {
  const { musicId, like } = req.body;
  const { userId } = req.params;

  let user;
  let targetMusic;

  try {
    user = await NewUser.findById(userId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!user) {
    return res.status(404).json({ message: "No User", ok: false });
  }

  try {
    targetMusic = await NewMusic.findById(musicId);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!targetMusic) {
    return res.status(404).json({ message: "No Music", ok: false });
  }

  if (like) {
    //사용자 목록에 추가하기
    if (!user.likedMusic.includes(targetMusic._id)) {
      await user.updateOne({
        $push: {
          likedMusic: {
            $each: [targetMusic._id], // 배열에 추가할 요소
            $slice: -20, // 배열의 길이를 20으로 유지
          },
        },
      });
    }
  } else {
    //사용자 목록에서 제거하기
    if (user.likedMusic.includes(targetMusic._id)) {
      await user.updateOne({
        $pull: {
          likedMusic: targetMusic._id,
        },
      });
    }
  }

  return res.status(200).json({ message: "Add User Like Playlist", ok: true });
};
