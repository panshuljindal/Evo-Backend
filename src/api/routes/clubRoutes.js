const express = require("express");
const {
  signupFunction,
  loginFunction,
  getParticularClub,
} = require("../handlers/clubFunctions");
const router = express.Router();

router.post("/signup", signupFunction);
router.post("/login", loginFunction);
router.get("/get/:id", getParticularClub);

module.exports = router;
