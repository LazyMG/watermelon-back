import Music from "../models/Music";
import User from "../models/User";

export const upload = (req, res) => {
  console.log("upload");
  return res.send("Upload");
};

export const musicDetail = (req, res) => {
  console.log("musicDetail");
  return res.send("musicDetail");
};

export const musicEdit = (req, res) => {
  console.log("musicEdit");
  return res.send("musicEdit");
};

export const musicDelete = (req, res) => {
  console.log("musicDelete");
  return res.send("musicDelete");
};

export const addList = (req, res) => {
  console.log("addList");
  return res.send("addList");
};

export const removeList = (req, res) => {
  console.log("removeList");
  return res.send("removeList");
};
