const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decode = await jwt.verify(token, process.env.Secret);
      let user = await User.findOne({ _id: decode._id, "tokens.token": token });
      if (!user) return res.status(403).json({ message: "You are not login!" });
      else {
        req.token = token;
        req.user = user;
        next();
      }
    } else {
      return res.status(401).json("You are not authenticated!.");
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyTokenAndAutherization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      (req?.user?.id === req.params.id && req.user.isActive) ||
      req.user.isAdmin
    )
      next();
    else {
      res.status(403).json({ message: "You are not allowed to do that!." });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) next();
    else {
      res.status(403).json("You are not allowed to do that!.");
    }
  });
};

module.exports = { verifyTokenAndAutherization, verifyTokenAndAdmin };
