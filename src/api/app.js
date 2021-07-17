const express = require("express");
const app = express();
var path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
app.use(express.static(path.join(__dirname, "../public")));

const clubRoutes = require("./routes/clubRoutes.js");
const eventRoutes = require("./routes/eventRoutes");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
// app.use(express.static('public'))

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

//User Routes
app.use("/club", clubRoutes);
app.use("/events", eventRoutes);

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
