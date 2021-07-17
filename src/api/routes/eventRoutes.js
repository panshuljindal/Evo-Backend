const express = require("express");
const {
  createEvent,
  getAllEvents,
  likeEvent,
  getPopularEvents,
} = require("../handlers/eventFunctions");
const clubCheck = require("../middleware/clubCheck");
const router = express.Router();

router.post("/create", clubCheck, createEvent);
router.get("/", getAllEvents);
router.put("/like", likeEvent);
router.get("/popular", getPopularEvents);

module.exports = router;
