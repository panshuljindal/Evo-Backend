const jwt = require("jsonwebtoken");
const Club = require("../../models/club");
require("dotenv/config");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send({
        message: "Auth Failed!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.club = decoded;

    if ((await Club.findById(req.club._id)) !== null) {
      next();
    } else {
      res.status(403).send({
        message: "club not found!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Token Invalid!",
    });
  }
};
