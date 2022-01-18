const express = require("express");
const {
  signupFunction,
  loginFunction,
  getParticularClub,
  getClubevents,
} = require("../handlers/clubFunctions");
const clubCheck = require("../middleware/clubCheck");
const router = express.Router();

router.post("/signup", signupFunction);
router.post("/login", loginFunction);
router.get("/get/:id", getParticularClub);
router.get("/events/:clubId",  getClubevents);
module.exports = router;
