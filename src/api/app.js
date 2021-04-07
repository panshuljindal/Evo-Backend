const express = require("express");
const app = express();
var path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
app.use(express.static(path.join(__dirname, "../public")));

const userRoutes = require("./routes/authroutes.js.js");
const adminRoutes = require("./routes/adminRoutes");
const admin = require("../models/admin.js.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
// app.use(express.static('public'))

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

//User Routes
app.use("/user", userRoutes);


//error handling
app.use((err, req, res, next) => {
  console.log(err);
  if (typeof err == "string") {
    return res.status(400).send({
      message: err,
    });
  }
  return res.status(400).send({
    message: err.message,
  });
});

module.exports = app;
