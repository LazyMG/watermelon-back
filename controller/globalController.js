import Music from "../models/Music";
import User from "../models/User";

export const home = (req, res) => {
  console.log("home");
  return res.send("Home");
};

export const search = (req, res) => {
  console.log("search");
  return res.send("Search");
};
