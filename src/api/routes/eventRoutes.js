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
} = require("../handlers/eventFunctions");
const clubCheck = require("../middleware/clubCheck");
const router = express.Router();

router.post("/create", clubCheck, createEvent);
router.get("/", getAllEvents);
router.put("/like", likeEvent);
router.get("/popular", getPopularEvents);
router.get("/get/:id", getEventById);
router.get("/search", searchCombined);
router.get("/club/:id", getEventByClub);
router.get("/saved", getSavedEvents);
module.exports = router;
