import jwt from "jsonwebtoken";

export const publicOnly = (req, res, next) => {
  console.log("middle", req.session);
  next();
};

export const privateOnly = (req, res, next) => {};

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      console.log("there is no error");
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.log(error);
    return next();
  }
};
