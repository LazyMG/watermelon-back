import { populate } from "dotenv";
import Album from "../models/Album";
import Artist from "../models/Artist";
import NewUser from "../models/NewUser";
import PlayList from "../models/Playlist";
import User from "../models/User";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const postDeleteUserPlaylist = async (req, res) => {
  const { playlistId } = req.body;
  const { id } = req.params;

  let user;
  let playlist;
  let isPlaylist = true;

  try {
    user = await NewUser.findById(id);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!user) {
    return res.status(404).json({ message: "No User", ok: false });
  }

  try {
    playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      isPlaylist = false;
      playlist = await Album.findById(playlistId);
    }
  } catch (error) {
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  try {
    if (isPlaylist) {
      await user.updateOne({
        $pull: { playlists: playlist._id },
      });
    } else {
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

export const postAddUserPlaylist = async (req, res) => {
  const { playlistId } = req.body;
  const { id } = req.params;

  let user;
  let playlist;
  let isPlaylist = true;

  try {
    user = await NewUser.findById(id);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  if (!user) {
    return res.status(404).json({ message: "No User", ok: false });
  }

  try {
    playlist = await PlayList.findById(playlistId).populate("owner");
    if (!playlist) {
      isPlaylist = false;
      playlist = await Album.findById(playlistId).populate("artist");
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

  //console.log(user)
  return res.status(200).json({
    message: "Add Playlist",
    playlist,
    ok: true,
    isUserHasPlaylist: true,
  });
};

export const postUserPlaylist = async (req, res) => {
  const { title, overview } = req.body;
  const { id } = req.params;

  let user;
  let playlist;

  try {
    user = await NewUser.findById(id);
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
      owner: id,
      overview,
    });
    //console.log(user);
    await user.updateOne({
      $push: { playlists: playlist._id },
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error" });
  }
  return res.status(200).json({ message: "Create Playlist", id: playlist._id });
};

export const getUserPlaylist = async (req, res) => {
  const { id } = req.params;
  let playlists;
  let albums;
  let user;

  try {
    // user = await NewUser.findById(id).populate({
    //   path: "playlists",
    //   select: "_id title owner",
    // });
    //user = await NewUser.findById(id).populate("playlists");
    user = await NewUser.findById(id)
      .populate({
        path: "playlists",
        populate: {
          path: "owner",
          model: "NewUser",
          select: "username _id",
        },
      })
      .populate({
        path: "albums",
        select: "coverImg title _id",
        populate: { path: "artist", model: "Artist", select: "_id artistName" },
      });
    playlists = user.playlists;
    albums = user.albums;
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error" });
  }

  return res
    .status(200)
    .json({ message: "Playlist", playlists, albums, ok: true });
};

export const getLogout = (req, res) => {
  req.session.destroy();
  //처리

  console.log("삭제후", req.session);

  return res.status(200).json({ message: "Logout", action: "delete" });
};

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
      return res.status(404).json({ message: "Login Password Error" });
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
    return res.status(404).json({ message: "DB Error" });
  }

  let token;
  token = jwt.sign({ userId: user.id }, "supersecret_dont_share", {
    expiresIn: "1h",
  });

  return res.status(200).json({
    message: "Login",
    ok: true,
    token,
    user: { userId: user._id, username: user.username, admin: user.admin },
  });
};

export const postCreateAccount = async (req, res) => {
  const { email, username, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return res.status(404).json({ message: "Password Error" });
  }

  try {
    const emailExists = await NewUser.exists({ email });
    if (emailExists) {
      return res.status(404).json({ message: "Email already exists" });
    }
  } catch (error) {
    return res.status(404).json({ message: "DB Error" });
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
    return res.status(404).json({ message: "Password Hash Error" });
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
    return res.status(404).json({ message: "DB Error" });
  }

  let token;
  token = jwt.sign({ userId: createdUser.id }, "supersecret_dont_share", {
    expiresIn: "1h",
  });

  return res.status(200).json({ message: "Create Account", ok: true, token });
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  let channel;
  let isArtist = false;

  try {
    channel = await NewUser.findById(id)
      .populate({ path: "playlists" })
      .populate({ path: "likedMusic" })
      .populate({ path: "recentMusic" });
    if (!channel) {
      channel = await Artist.findById(id)
        .populate("albumList")
        .populate({
          path: "musicList",
          options: { limit: 5 },
          populate: [
            {
              path: "album",
            },
            {
              path: "artist",
            },
          ],
        });
      isArtist = true;
    }
    //console.log(channel);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error", ok: false });
  }

  return res
    .status(200)
    .json({ message: "Channel Data", channel, isArtist, ok: true });
};

export const editUser = (req, res) => {
  return res.send("editUser");
};

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
