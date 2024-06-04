import User from "../models/User";

export const getLogout = (req, res) => {
  return res.send("getLogout");
};

export const postLogin = (req, res) => {
  return res.send("postLogin");
};

export const postCreateAccount = (req, res) => {
  return res.send("postCreateAccount");
};

export const getUser = (req, res) => {
  return res.send("getUser");
};

export const editUser = (req, res) => {
  return res.send("editUser");
};

export const postGoogleLogin = (req, res) => {
  return res.send("postGoogleLogin");
};
