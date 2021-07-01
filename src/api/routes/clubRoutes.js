const express = require("express");
const { signupFunction, loginFunction } = require("../handlers/clubFunctions");
const router = express.Router();

router.post("/signup", signupFunction);
router.post("/login", loginFunction);

module.exports = router;
