const express = require("express");
const {
  signupFunction,
  loginFunction,
  getParticularClub,
  getClubevents,
  editProfile,
} = require("../handlers/clubFunctions");
const clubCheck = require("../middleware/clubCheck");
const router = express.Router();

router.post("/signup", signupFunction);
router.post("/login", loginFunction);
router.get("/get/:id", getParticularClub);
router.get("/events/:clubId", getClubevents);
router.post("/editClubProfile/:clubId", clubCheck, editProfile);
module.exports = router;
