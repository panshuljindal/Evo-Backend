const Event = require("../../models/event");
const Club = require("../../models/club");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: String(process.env.cloud_name),
  api_key: String(process.env.api_key),
  api_secret: String(process.env.api_secret),
});
async function createEvent(req, res, next) {
  try {
    var poster = "";
    if (req.body.poster && req.body.poster.length != 0)
      await cloudinary.uploader.upload(
        "data:image/jpeg;base64," + req.body.poster,
        function (error, result) {
          if (result) poster = result.url;
          else throw error;
        }
      );
    let eventData = {
      ...req.body,
      club: req.club._id,
      poster: poster,
      clubName: req.club.name,
    };
    const event = new Event(eventData);
    const createdEvent = await event.save();
    await Club.findByIdAndUpdate(req.club._id, {
      $push: { events: createdEvent._id },
    });
    res.status(200).send(createdEvent);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getAllEvents(req, res, next) {
  try {
    var query = {};
    //   "isPaid": true,
    //   "isGravitas": false,
    //   "isRiviera": false,
    //   "isHack": true,
    //   "eventType": "Technical",
    if (req.query.paid && req.query.paid.length != 0)
      query.isPaid = req.query.paid;
    if (req.query.gravitas && req.query.gravitas.length != 0)
      query.isGravitas = req.query.gravitas;
    if (req.query.riviera && req.query.riviera.length != 0)
      query.isRiviera = req.query.riviera;
    if (req.query.hack && req.query.hack.length != 0)
      query.isHack = req.query.hack;
    if (req.query.type && req.query.type.length != 0)
      query.eventType = req.query.type;
    const events = await Event.find(query);
    res.status(200).send(events);
  } catch (error) {
    res.status(500).send(error);
  }
}
module.exports = { createEvent, getAllEvents };
