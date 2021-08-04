const express = require("express");
const {
  createEvent,
  getAllEvents,
  likeEvent,
  getPopularEvents,
  getEventById,
  searchCombined,
} = require("../handlers/eventFunctions");
const clubCheck = require("../middleware/clubCheck");
const router = express.Router();

router.post("/create", clubCheck, createEvent);
router.get("/", getAllEvents);
router.put("/like", likeEvent);
router.get("/popular", getPopularEvents);
router.get("/get/:id", getEventById);
router.get("/search", searchCombined);
module.exports = router;
