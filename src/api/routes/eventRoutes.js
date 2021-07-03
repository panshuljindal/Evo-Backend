const express = require("express");
const { createEvent, getAllEvents } = require("../handlers/eventFunctions");
const clubCheck = require("../middleware/clubCheck");
const router = express.Router();

router.post("/create", clubCheck, createEvent);
router.get("/", getAllEvents);

module.exports = router;
