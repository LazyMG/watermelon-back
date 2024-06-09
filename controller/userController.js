import NewUser from "../models/NewUser";
import PlayList from "../models/Playlist";
import User from "../models/User";

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
  let user;

  try {
    // user = await NewUser.findById(id).populate({
    //   path: "playlists",
    //   select: "_id title owner",
    // });
    //user = await NewUser.findById(id).populate("playlists");
    user = await NewUser.findById(id).populate({
      path: "playlists",
      populate: {
        path: "owner",
        model: "NewUser", // 여기에 실제 User 모델 이름을 넣으세요
        select: "username _id",
      },
    });
    playlists = user.playlists;
    //console.log(playlists);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "DB Error" });
  }

  return res.status(200).json({ message: "Playlist", playlists });
};

export const getLogout = (req, res) => {
  req.session.destroy();
  //처리

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
    if (password !== user.password) {
      return res.status(404).json({ message: "Login Error" });
    }
    req.session.loggedIn = true;
    req.session.user = user;
  } catch (error) {
    return res.status(404).json({ message: "DB Error" });
  }
  return res.status(200).json({ message: "Login", user });
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

  try {
    await NewUser.create({
      email,
      username,
      password,
      admin,
    });
  } catch (error) {
    console.log(error);

    return res.status(404).json({ message: "DB Error" });
  }

  return res.status(200).json({ message: "Create Account" });
};

export const getUser = (req, res) => {
  return res.send("getUser");
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
    return res.status(404).json({ message: "Login Error" });
  }

  let exists;

  try {
    exists = await NewUser.exists({ email: info.email });
  } catch (error) {
    return res.status(404).json({ message: "DB Error" });
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
      return res.status(404).json({ message: "DB Error" });
    }
  } else {
    try {
      user = await NewUser.findOne({
        email: info.email,
      });
    } catch (error) {
      return res.status(404).json({ message: "DB Error" });
    }
  }
  console.log(user);
  req.session.loggedIn = true;
  req.session.user = user;
  return res.status(200).json({ message: "Login", user });
};
