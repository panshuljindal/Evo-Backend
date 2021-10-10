const express = require("express");
const {
  createEvent,
  getAllEvents,
  likeEvent,
  getPopularEvents,
  getEventById,
  searchCombined,
  getEventByClub,
  getSavedEvents,
  dislikeEvent,
} = require("../handlers/eventFunctions");
const {
  getData,
  likeEventNew,
  dislikeEventNew,
  interestedEventNew,
  disInterestedEventNew,
  registerDevice,
} = require("../handlers/userFunctions");
const clubCheck = require("../middleware/clubCheck");
const deviceCheck = require("../middleware/deviceCheck");
const router = express.Router();

router.post("/create", clubCheck, createEvent);
router.get("/", deviceCheck, getAllEvents);
router.put("/like", deviceCheck, likeEvent);
router.put("/dislike", deviceCheck, dislikeEvent);
router.get("/popular", deviceCheck, getPopularEvents);
router.get("/get/:id", deviceCheck, getEventById);
router.post("/search", deviceCheck, searchCombined);
router.get("/club/:id", deviceCheck, getEventByClub);
router.post("/saved", deviceCheck, getSavedEvents);
router.post("/newDevice", deviceCheck, registerDevice);
router.get("/getData/:id", deviceCheck, getData);
router.post("/likeNew", deviceCheck, likeEventNew);
router.post("/dislikeNew", deviceCheck, dislikeEventNew);
router.post("/interested", deviceCheck, interestedEventNew);
router.post("/disinterest", deviceCheck, disInterestedEventNew);
module.exports = router;
