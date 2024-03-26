import User from "../models/User";

export const profile = (req, res) => {
  console.log("Profile");
  return res.send("Profile");
};

export const login = (req, res) => {
  console.log("Login");
  return res.send("Login");
};

export const logout = (req, res) => {
  console.log("Logout");
  return res.send("Logout");
};
