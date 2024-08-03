import Album from "../models/Album";
import Artist from "../models/Artist";
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

//userRouter - Library.jsx - getUserPlaylist
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

  // let token;
  // token = jwt.sign({ userId: user.id }, "supersecret_dont_share", {
  //   expiresIn: "1h",
  // });

  return res.status(200).json({
    message: "Login",
    ok: true,
    // token,
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

//userRouter - Channel.jsx - getChannelData
//사용자 또는 가수의 정보 GET
export const getUser = async (req, res) => {
  const { userId } = req.params;

  let channel;
  let isArtist = false;

  try {
    //사용자일 때
    channel = await NewUser.findById(userId)
      .populate({ path: "playlists" }) //재생목록
      .populate({ path: "likedMusic" }) //좋아요한 노래
      .populate({ path: "recentMusic" }); //최근 들은 노래
    //가수일 때
    if (!channel) {
      channel = await Artist.findById(userId)
        .populate("albumList") //모든 앨범
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
