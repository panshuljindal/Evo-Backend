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

    const decoded = jwt.verify(token, process.env.SECURITY_KEY);

    if (decoded) {
      next();
    } else {
      res.status(400).send({
        message: "Not Authorised!",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Token Invalid!",
    });
  }
};
