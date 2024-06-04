import Music from "../models/Music";
import User from "../models/User";

export const getSearchResult = async (req, res) => {
  return res.send("getSearchResult");
};

export const home = async (req, res) => {
  console.log("home");
  //음악들 불러오기
  const allMusics = await Music.find({});
  const recentMusics = allMusics.sort(() => 0.5 - Math.random()).slice(0, 6);
  const recommendMusics = allMusics
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);
  //console.log(recentMusics, recommendMusics);
  return res.json(allMusics);
};
